ML folder

This folder contains scripts to train scikit-learn models, run a small Flask API, run a TFJS prototype, and a JS/TS linear regressor example.

Steps (Python training + API):

1. Create a Python virtualenv and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r ml/requirements.txt
```

2. Train models and evaluate (saves models to `ml/models/`):

```bash
python ml/train_and_evaluate.py
```

3. Run the API (after training):

```bash
python ml/api.py
# POST to http://127.0.0.1:5001/predict with JSON
```

TFJS prototype (node):

- See `src/ml/tfjs_model.js` — requires `@tensorflow/tfjs-node` to run in node.

TypeScript linear regressor:

- See `ml/ts_linear_regression.ts` for an example implementation (requires `ts-node` to run).

Evaluation:

- Cross-validated RMSE is printed by `train_and_evaluate.py` and saved to `ml/models/training_summary.joblib`.

Notes:
- Models are simple baseline regressors for carbon and energy predictions.
- For production, consider containerizing the API and securing the endpoint.
