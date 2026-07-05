import pytest
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, model, FEATURE_NAMES

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_route(client):
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data
    if model is not None:
        assert data['status'] == 'healthy'
    else:
        assert data['status'] == 'model_not_loaded'

def test_predict_success(client):
    if model is None:
        pytest.skip("Model.pkl not loaded, skipping prediction test")
    
    payload = {
        "features": [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 2.0, 1, 0, 1, 4]
    }
    response = client.post('/predict',
                            data=json.dumps(payload),
                            content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    
    assert 'prediction' in data
    assert data['prediction'] in [0, 1]
    assert 'probability' in data
    assert 'asd' in data['probability']
    assert 'no_asd' in data['probability']
    assert 'confidence' in data
    assert 'risk_level' in data
    assert data['risk_level'] in ['High', 'Medium', 'Low']

def test_predict_invalid_feature_count(client):
    payload = {
        "features": [1, 0, 1, 0, 1, 1, 1, 0, 1, 0]
    }
    response = client.post('/predict',
                            data=json.dumps(payload),
                            content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
    assert "Expected" in data['error']

def test_predict_missing_payload(client):
    payload = {}
    response = client.post('/predict',
                            data=json.dumps(payload),
                            content_type='application/json')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
