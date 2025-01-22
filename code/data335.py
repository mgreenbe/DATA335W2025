import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import Tuple


@dataclass(frozen=True)
class Formula:
    response: str
    predictors: Tuple[str, ...]


def parse_formula(formula: str):
    raise NotImplementedError


def fit_lm(X: np.ndarray, y: np.ndarray): ...
