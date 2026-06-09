"""
Train RandomForest and GradientBoosting models on the provided CSV and
produce cross-validated RMSE metrics. Saves trained models to ml/models/.
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import cross_val_score, KFold
from sklearn.metrics import mean_squared_error

DATA_CSV = os.path.join(os.path.dirname(__file__), '..', 'lca_metals_dataset.csv')
OUT_DIR = os.path.join(os.path.dirname(__file__), 'models')

FEATURE_COLS = ['recycling_rate', 'renewable_share', 'transport_km', 'mci', 'scrap_recovery_rate']
TARGETS = ['carbon_kgCO2_per_kg', 'energy_MJ_per_kg']

os.makedirs(OUT_DIR, exist_ok=True)

print('Loading dataset...', DATA_CSV)
df = pd.read_csv(DATA_CSV)
# Basic cleaning: drop rows with missing features or targets
df = df.dropna(subset=FEATURE_COLS + TARGETS)

X = df[FEATURE_COLS].values

results = {}

kf = KFold(n_splits=5, shuffle=True, random_state=42)

for target in TARGETS:
    y = df[target].values

    models = {
        'random_forest': RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1),
        'gradient_boosting': GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, random_state=42)
    }

    for name, model in models.items():
        print(f'Training {name} for {target}...')
        # Cross-validated RMSE
        neg_mse = cross_val_score(model, X, y, scoring='neg_mean_squared_error', cv=kf, n_jobs=-1)
        rmse_scores = np.sqrt(-neg_mse)
        mean_rmse = rmse_scores.mean()
        results[f'{name}_{target}_rmse'] = float(mean_rmse)
        # Fit on full data and save
        model.fit(X, y)
        model_path = os.path.join(OUT_DIR, f'{name}_{target}.joblib')
        joblib.dump(model, model_path)
        print(f'Saved model to {model_path} (CV RMSE={mean_rmse:.4f})')

print('\nEvaluation results:')
for k, v in results.items():
    print(f'{k}: {v:.4f}')

# Save summary
joblib.dump(results, os.path.join(OUT_DIR, 'training_summary.joblib'))
print('Training complete.')
