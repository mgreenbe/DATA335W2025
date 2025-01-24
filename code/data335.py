import numpy as np
import pandas as pd
import re
from dataclasses import dataclass, field
from typing import Sequence
from numpy.typing import NDArray, ArrayLike
from scipy.linalg import solve_triangular
from scipy.linalg.lapack import dtrtri  # type: ignore
from pandas._typing import ArrayLike as PandasArrayLike  # type: ignore


@dataclass(frozen=True, kw_only=True, slots=True)
class LMSpec:
    response: str
    predictors: Sequence[str]
    fit_intercept: bool


def parse_formula(string: str):
    sides = string.split("~")
    assert len(sides) > 0
    if len(sides) == 1:
        assert "~" not in string
        raise SyntaxError("Formula must contain the ~ character.")
    if len(sides) > 2:
        assert len(re.findall(string, "~")) > 1
        raise SyntaxError("Formula can only contain a single ~ character.")

    response = sides[0].strip()
    if response == "":
        raise SyntaxError("Left-hand-side cannot be empty.")

    predictors = []
    wildcard = False
    fit_intercept = None
    lhs_terms = [term.strip() for term in sides[1].split("+")]
    for term in lhs_terms:
        if term == "":
            raise SyntaxError("Empty term")
        elif term == "1":
            if fit_intercept is not None:
                raise SyntaxError("Multiple intercept terms.")
            fit_intercept = True
        elif term == "-1" or term == "0":
            if fit_intercept is not None:
                raise SyntaxError("Multiple intercept terms.")
            fit_intercept = False
        elif term == ".":
            if wildcard:
                raise SyntaxError("Multiple uses of wildcard '.'")
            if predictors != []:
                raise SyntaxError(
                    f"Wildcard '.' in the presence of another predictor ({predictors[0]})."
                )
            wildcard = True

        else:
            if wildcard:
                raise SyntaxError(
                    f"Wildcard '.' in the presence of another predictor ({term})."
                )
            elif term in predictors:
                raise SyntaxError(f"Repeated term: {term}")
            else:
                predictors.append(term)
    if fit_intercept is None:
        fit_intercept = True
    return LMSpec(
        response=response,
        predictors=predictors,
        fit_intercept=fit_intercept,
    )


@dataclass(frozen=True, kw_only=True, slots=True)
class QRFitResult:
    coef: NDArray[np.float64]
    fitted: NDArray[np.float64] = field(repr=False)
    resid: NDArray[np.float64] = field(repr=False)
    diag: NDArray[np.float64] = field(repr=False)


class QR:
    Q: NDArray[np.float64]
    R: NDArray[np.float64]

    def __init__(self, x: ArrayLike | PandasArrayLike):
        x = np.array(x, dtype=np.float64)
        Q, R = np.linalg.qr(x)
        assert Q.dtype.type is np.float64 and R.dtype.type is np.float64
        self.Q = Q
        self.R = R

    def solve(self, y: ArrayLike | PandasArrayLike) -> NDArray[np.float64]:
        y = np.array(y, dtype=np.float32)
        b = solve_triangular(self.R, self.Q.T @ y)
        assert b.dtype.type is np.float64
        return b

    def fit(self, y: ArrayLike | PandasArrayLike) -> QRFitResult:
        R = self.R
        Q = self.Q
        y = np.array(y, dtype=np.float32)
        Rinv = dtrtri(R, lower=0)[0]
        coef = Rinv @ Q.T @ y
        fitted = Q @ (R @ coef)
        resid = y - fitted
        diag = np.diagonal(Rinv @ Rinv.T)
        assert (
            coef.dtype.type is np.float64
            and fitted.dtype.type is np.float64
            and resid.dtype.type is np.float64
        )
        return QRFitResult(coef=coef, fitted=fitted, resid=resid, diag=diag)


class LM:
    spec: LMSpec
    df_residual: int
    coefficients: NDArray[np.float64]
    cov_unscaled: NDArray[np.float64]
    fitted_values: NDArray[np.float64]
    residuals: NDArray[np.float64]
    sigma: np.float64

    def __init__(self, spec: LMSpec, data: pd.DataFrame):
        X = data[spec.predictors].to_numpy(dtype=np.float64)
        n, p = X.shape

        if spec.fit_intercept:
            X = np.hstack((np.ones((n, 1)), X))
        y = data[spec.response].to_numpy(dtype=np.float64)

        Q, R = np.linalg.qr(X)
        if any(np.abs(np.diagonal(R)) < 1e-8):
            raise np.linalg.LinAlgError("Singular design matrix.")
        df_residual = n - p

        Rinv = dtrtri(R, lower=0)[0]
        cov_unscaled = Rinv @ Rinv.T
        coefficients = Rinv @ Q.T @ y
        fitted_values = Q @ (R @ coefficients)
        residuals = y - fitted_values

        residual_ss = np.sum(residuals**2)
        residual_var = residual_ss / df_residual
        sigma = np.sqrt(residual_var)

        self.spec = spec
        self.coefficients = coefficients
        self.cov_unscaled = cov_unscaled
        self.fitted_values = fitted_values
        self.residuals = residuals
        self.df_residual = df_residual


df = pd.read_csv("test/data/x0-2_y_20.csv")
X = df[["x0", "x1"]].values
y = df["y"].values

qr = QR(X)
qr.fit(y)
