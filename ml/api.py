"""
Simple Flask API to serve saved scikit-learn models.
POST /predict
  JSON body: {"features": {"recycling_rate":.., "renewable_share":.., "transport_km":.., "mci":.., "scrap_recovery_rate":..}, "target": "carbon"|"energy", "model": "random_forest"|"gradient_boosting"}
Returns JSON with prediction.
"""
import os
import joblib
from flask import Flask, request, jsonify
try:
    from flask_cors import CORS
except Exception:
    CORS = None

app = Flask(__name__)
if CORS:
    CORS(app)
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

MODEL_MAP = {
    'random_forest': {'carbon': 'random_forest_carbon_kgCO2_per_kg.joblib',
                      'energy': 'random_forest_energy_MJ_per_kg.joblib'},
    'gradient_boosting': {'carbon': 'gradient_boosting_carbon_kgCO2_per_kg.joblib',
                          'energy': 'gradient_boosting_energy_MJ_per_kg.joblib'}
}

# Lazy-loaded cache
_loaded_models = {}

FEATURE_ORDER = ['recycling_rate', 'renewable_share', 'transport_km', 'mci', 'scrap_recovery_rate']

def load_model(model_name, target):
    key = f'{model_name}_{target}'
    if key in _loaded_models:
        return _loaded_models[key]
    fname = MODEL_MAP.get(model_name, {}).get(target)
    if not fname:
        return None
    path = os.path.join(MODEL_DIR, fname)
    if not os.path.exists(path):
        return None
    m = joblib.load(path)
    _loaded_models[key] = m
    return m

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    features = data.get('features', {})
    target = data.get('target', 'carbon')
    model_name = data.get('model', 'random_forest')

    # Validate
    missing = [f for f in FEATURE_ORDER if f not in features]
    if missing:
        return jsonify({'error': 'missing features', 'missing': missing}), 400

    model = load_model(model_name, 'carbon' if target == 'carbon' else 'energy')
    if model is None:
        return jsonify({'error': 'model not available'}), 404

    x = [features[f] for f in FEATURE_ORDER]
    pred = float(model.predict([x])[0])
    return jsonify({'prediction': pred})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
