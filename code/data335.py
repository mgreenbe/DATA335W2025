import numpy as np
import pandas as pd
import scipy.stats as stats
from typing import Sequence
from formulaic import model_matrix, ModelSpec, ModelSpecs, ModelMatrix
from arviz import InferenceData
from dataclasses import dataclass, field
from numpy.typing import ArrayLike, NDArray
from cmdstanpy import CmdStanModel, CmdStanMCMC
from bambi import Model as BambiModel
from IPython.display import display


def table(s: pd.Series):
    """Display a series horizontally."""
    df = pd.DataFrame(
        {str(k): [v] for k, v in zip(s.index, s.values)}, index=[s.name or ""]
    )
    display(df)


_mad_sd_scale = stats.norm().ppf(0.75)  # This is 1/1.482602218505602.


def mad(x: ArrayLike, **kwargs):
    """
    Same as stats.median_abs_deviation but with scale defaulting
    to 1/1.482602218505602 (note reciprocal!) instead of to 1.0.
    """
    if "scale" not in kwargs:
        kwargs["scale"] = _mad_sd_scale
    return stats.median_abs_deviation(x, **kwargs)


@dataclass(kw_only=True)
class TTestResult:
    df: int
    stat: NDArray[np.float64]
    pval: NDArray[np.float64]


@dataclass(kw_only=True)
class FTestResult:
    df1: int
    df2: int
    stat: np.float64
    pval: np.float64


@dataclass(kw_only=True)
class FitComparison:
    r2: np.float64
    r2_adj: np.float64
    ftest: FTestResult

    def _repr_html_(self):
        r2 = self.r2
        r2_adj = self.r2_adj
        ftest = self.ftest

        html = f"""<pre>\
Multiple R-squared: {r2:.6f}, Adjusted R-squared: {r2_adj:.6f}
F-statistic: {ftest.stat:.6f} on {ftest.df1} and {ftest.df2} DF, p-value: {ftest.pval:.6f}</pre>\
"""
        return html


@dataclass(kw_only=True)
class LMFit:
    model_specs: ModelSpecs
    features: Sequence[str]
    n: int
    unscaled_coef_cov: NDArray[np.float64] = field(repr=False)
    coef_est: NDArray[np.float64] = field(repr=False)
    ss: np.float64 = field(repr=False)

    df: int = field(init=False)
    se: np.float64 = field(init=False, repr=False)
    coef_se: NDArray[np.float64] = field(init=False, repr=False)
    ttest: TTestResult = field(init=False, repr=False)

    def __post_init__(self):
        unscaled_coef_cov = self.unscaled_coef_cov
        coef_est = self.coef_est
        ss = self.ss
        n = self.n

        df = n - len(coef_est)
        se = np.sqrt(ss / df).astype(np.float64)
        coef_se = se * np.sqrt(unscaled_coef_cov.diagonal())
        coef_tstat = coef_est / coef_se
        ttest = TTestResult(
            df=df, stat=coef_tstat, pval=2 * stats.t(df).cdf(-np.abs(coef_tstat))
        )

        self.df = df
        self.se = se
        self.coef_se = coef_se
        self.ttest = ttest

    def predict(self, new_data: pd.DataFrame):
        model_specs = self.model_specs
        assert isinstance(model_specs, ModelSpecs)
        X = model_matrix(model_specs.rhs, new_data)
        assert isinstance(X, ModelMatrix)
        return X @ self.coef_est

    def _repr_html_(self):
        features = self.features
        coef_est = self.coef_est
        coef_se = self.coef_se
        se = self.se
        ttest = self.ttest

        summary = {
            "estimate": [*coef_est, se],
            "standard error": [*coef_se, ""],
            "t-statistic": [*ttest.stat, ""],
            "p-value": [*ttest.pval, ""],
        }

        summary_df = pd.DataFrame(summary, index=pd.Index([*features, "sigma"]))
        return summary_df._repr_html_()  # type: ignore


def lm(
    formula_or_specs: str | ModelSpecs,
    data: pd.DataFrame,
):
    if isinstance(formula_or_specs, str):
        model_specs = ModelSpec.from_spec(formula_or_specs)
        if not isinstance(model_specs, ModelSpecs):
            raise Exception("model_specs isn't of the expected type.")
    else:
        model_specs = formula_or_specs
    y, X = model_matrix(model_specs, data)
    n = len(y)
    assert isinstance(y, pd.DataFrame)
    y = y.to_numpy().astype(np.float64).squeeze()
    assert y.ndim == 1

    assert isinstance(X, pd.DataFrame)
    features = list(X.columns)

    X = X.to_numpy().astype(np.float64)
    p = X.shape[1]
    if p == 0:
        raise Exception(f"Degeneate data matrix: shape = {X.shape}")

    unscaled_coef_cov = np.linalg.inv(X.T @ X)
    coef_est = unscaled_coef_cov @ (X.T @ y)
    yfit = X @ coef_est
    resid = y - yfit
    ss = np.sum(resid**2)

    fit = LMFit(
        model_specs=model_specs,
        features=features,
        n=n,
        coef_est=coef_est,
        unscaled_coef_cov=unscaled_coef_cov,
        ss=ss,
    )
    return fit


def compare_fits(full: LMFit, reduced: LMFit):
    r2 = 1 - full.ss / reduced.ss
    r2_adj = 1 - (full.ss / full.df) / (reduced.ss / reduced.df)
    num = (reduced.ss - full.ss) / (reduced.df - full.df)
    denom = full.ss / full.df
    stat = num / denom
    df1 = reduced.df - full.df
    df2 = full.df
    pval = 1 - stats.f(df1, df2).cdf(stat)
    ftest = FTestResult(df1=df1, df2=df2, stat=stat, pval=pval)
    return FitComparison(r2=r2, r2_adj=r2_adj, ftest=ftest)


@dataclass(kw_only=True)
class StanLMFit:
    model_specs: ModelSpecs
    features: Sequence[str]
    model: CmdStanModel
    stan_mcmc: CmdStanMCMC = field(repr=False)
    draws: pd.DataFrame = field(init=False, repr=False)

    median: pd.Series = field(init=False, repr=False)
    mad_sd: pd.Series = field(init=False, repr=False)
    summary: pd.DataFrame = field(init=False)

    def __post_init__(self):
        stan_mcmc = self.stan_mcmc
        features = self.features

        stan_draws = stan_mcmc.draws_pd()
        draws = pd.DataFrame(
            {
                "Intercept": stan_draws["alpha"],
                **{
                    feature: stan_draws[f"beta[{i + 1}]"]
                    for i, feature in enumerate(features)
                },
                "sigma": stan_draws["sigma"],
            }
        )

        median = draws.median()
        median.name = "median"
        mad_sd = pd.Series(mad(draws, axis=0), median.index, name="mad_sd")
        summary = pd.concat([median, mad_sd], axis=1)

        self.draws = draws
        self.median = median
        self.mad_sd = mad_sd
        self.summary = summary

    def posterior_predict(self, new_data):
        model_specs = self.model_specs
        draws = self.draws

        assert isinstance(model_specs, ModelSpecs)
        X = model_matrix(model_specs.rhs, new_data)
        assert isinstance(X, ModelMatrix)
        coef_draws = (
            draws[[c for c in draws.columns if c != "sigma"]]
            .to_numpy()
            .astype(np.float64)
        )
        sigma_draws = draws["sigma"].to_numpy().astype(np.float64)
        error_draws = stats.norm(0, sigma_draws).rvs()
        y = X @ coef_draws.T + error_draws
        return y

    def _repr_html_(self):
        summary = self.summary
        return summary._repr_html_()  # type: ignore


def stan_lm(
    formula_or_specs: str | ModelSpecs,
    data: pd.DataFrame,
):
    if isinstance(formula_or_specs, str):
        model_specs = ModelSpec.from_spec(formula_or_specs)
        if not isinstance(model_specs, ModelSpecs):
            raise Exception("model_specs isn't of the expected type.")
    else:
        model_specs = formula_or_specs

    y, X = model_matrix(model_specs, data)

    assert isinstance(y, pd.DataFrame)
    y = y.to_numpy().astype(np.float64).squeeze()
    assert y.ndim == 1

    assert isinstance(X, pd.DataFrame)
    X.pop("Intercept")
    features = list(X.columns)
    x = X.to_numpy().astype(np.float64)

    N = len(y)
    K = x.shape[1]
    if K == 0:
        raise Exception(f"Degeneate data matrix: shape = {x.shape}")
    stan_data = dict(N=N, K=K, x=x, y=y)
    model = CmdStanModel(stan_file="lr.stan")
    stan_mcmc = model.sample(data=stan_data)
    fit = StanLMFit(
        model_specs=model_specs,
        features=features,
        model=model,
        stan_mcmc=stan_mcmc,
    )
    return fit


@dataclass
class BambiLMFit:
    formula: str
    model: BambiModel
    inference_data: InferenceData = field(repr=False)
    draws: pd.DataFrame = field(init=False, repr=False)
    summary: pd.DataFrame = field(init=False)

    def __post_init__(self):
        inference_data = self.inference_data
        posterior = inference_data["posterior"]
        draws = pd.DataFrame(
            dict({k: v.to_numpy().ravel() for k, v in posterior.data_vars.items()})
        )

        median = draws.median()
        median.name = "median"
        mad_sd = pd.Series(mad(draws, axis=0), median.index, name="mad_sd")
        summary = pd.concat([median, mad_sd], axis=1)

        self.draws = draws
        self.median = median
        self.mad_sd = mad_sd
        self.summary = summary

    def _repr_html_(self):
        summary = self.summary
        return summary._repr_html_()  # type: ignore


def bambi_lm(
    formula: str,
    data: pd.DataFrame,
):
    model = BambiModel(formula, data)
    inference_data = model.fit()
    bambi_lm_fit = BambiLMFit(
        formula=formula, model=model, inference_data=inference_data
    )
    return bambi_lm_fit
