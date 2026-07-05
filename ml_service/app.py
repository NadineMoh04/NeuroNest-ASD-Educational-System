from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✅ ML Model loaded successfully!")
except FileNotFoundError:
    print("❌ Model file not found. Please train the model first.")
    model = None

FEATURE_NAMES = [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10_Autism_Spectrum_Quotient',
    'Age_Years', 'Jaundice', 'Family_mem_with_ASD',
    'Sex_en', 'Ethnicity_en'
]


@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        print('ERROR: Model not loaded')
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        print('Received prediction request')
        print('Request headers:', dict(request.headers))
        print('Request origin:', request.headers.get('Origin'))

        data = request.json
        features = data.get('features', [])

        print(f'Received {len(features)} features')
        print('Features:', features)

        if len(features) != len(FEATURE_NAMES):
            error_msg = f'Expected {len(FEATURE_NAMES)} features, got {len(features)}'
            print('ERROR:', error_msg)
            return jsonify({'error': error_msg}), 400

        features_array = np.array(features).reshape(1, -1)

        prediction = model.predict(features_array)[0]
        probability = model.predict_proba(features_array)[0]

        result = {
            'prediction': int(prediction),
            'probability': {
                'no_asd': float(probability[0]),
                'asd': float(probability[1])
            },
            'confidence': float(max(probability)),
            'risk_level': 'High' if probability[1] > 0.7 else 'Medium' if probability[1] > 0.3 else 'Low'
        }

        print('Prediction result:', result)
        return jsonify(result)

    except Exception as e:
        print('EXCEPTION in prediction:', str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    status = 'healthy' if model is not None else 'model_not_loaded'
    return jsonify({'status': status})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)
