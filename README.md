# DATA 335 - Statistical Modeling I - Winter 2025

## Teaching staff

### Instructor
Matthew Greenberg (mgreenbe@ucalgary.ca)

#### Office hours
MW 12:30-13:30 in MS 434, or by appointment

### Teaching Assistant
Sorif Hossain (sorif.hossain@ucalgary.ca)

## Meetings

### Lecture
MWF 14:00-14:50 in KNB 126

***I'll be out of town on Friday, January 17 and Monday, January 20. I'll post video lecture for those two classes through the D2L site for you to consume asynchronously.***

### Tutorial
Tu 14:00-15:50 in MS 521

***There is no tutorial during the first week. Tutorials start on Tuesday, January 21.***

## Grading

Four assignments worth 25% each, due Febuary 3, March 3, March 24, and April 14. Submit both a runnable Jupyter notebook .ipynb file and a static .pdf file to the appropriate D2L dropbox.

Roughly half each assignment will be drawn from lab problems, the other half coming from the textbook and other sources.

## Official description
*An introduction to statistical computing and Bayesian modelling. Topics covered include random numbers generation, system/process simulation and evaluation, numerical integration, constrained and unconstrained optimization, Bayesian inference framework, single and multi-parameter models, regression models, Bayesian hierarchical modelling, Markov chain Monte Carlo.* [source](https://www.ucalgary.ca/pubs/calendar/archives/2023/data-science.html#43038)

## Textbook
**GHV**: Mark Gelman, Jennifer Hill, and Aki Vehtari, ***Regression and Other Stories***. [web](https://avehtari.github.io/ROS-Examples/), [pdf](https://users.aalto.fi/~ave/ROS.pdf), [github](https://github.com/avehtari/ROS-Examples/tree/master)

## Supplementary reading
Mark Gelman and Aki Vehtari, ***Active Statistics***. [web](https://avehtari.github.io/ActiveStatistics/), [pdf](https://users.aalto.fi/~ave/ActiveStatistics.pdf)

Mark Gelman, ***Statistical Modeling, Causal Inference, and Social Science***. [blog](https://statmodeling.stat.columbia.edu)

## Syllabus

1. Fundamentals
   - GHV Chapters 4-5 (read Chapters 1-3 on you own, as review)
2. Linear regression
   - GHV Chapters 6-12
3. Generalized linear models
   - GHV Chapters 13-15
4. Before and after fitting a regression
   - GHV Chapters 16-17
5. Causal inference
   - GHV Chapters 18-21
6. What comes next?
   - GHV Chapter 22

And maybe some other topics as time permits (it never does).

## Cross-cutting themes

- Statistical modeling workflow, [Bayesian workflow](http://www.stat.columbia.edu/~gelman/research/unpublished/Bayesian_Workflow_article.pdf)
- Visualization for exploration, summarization, diagnostics; Matplotlib, [ArviZ](https://python.arviz.org/en/stable/)
- Python, NumPy, pandas, [PyStan](https://github.com/stan-dev/pystan) or [PyMC](https://www.pymc.io/welcome.html) (preferences?)
- Simulation and sampling
- Array (tensor) programming -- slicing, vectorization, einsum
- Numerical methods, algorithms

## Downloading the course materials

1. Clone this repo
```
git clone https://github.com/mgreenbe/DATA335W2025.git
```
and move into its directory:
```
cd DATA335W2025
```

2. Make a virtual environment, activate it, and install packages:
```
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

3. To update your local clone of the repo, run `git pull` from the repo root. To be notified about updates, watch repo by clicking the *Watch* button at the top of [repo's GitHub page](https://github.com/mgreenbe/DATA335W2025).

## Contributing

### Fixing mistakes
If you find an error in any of the material in this repo, please help me fix. If you can fix it yourself, please do so and submit a PR. If you suspect an error, open an issue.

### Suggestions and discussion
I'm very happy to take suggestions or have discussions in the issues tab. Feel free to open them and to engage with any open issues. Please keep in mind, though, that all of these interactions are public.