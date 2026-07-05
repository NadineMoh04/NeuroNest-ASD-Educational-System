import pickle
import numpy as np

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

features = np.array([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 5, 1, 0]).reshape(1, -1)
prediction = model.predict(features)
probability = model.predict_proba(features)

print('Prediction:', prediction[0])
print('Probability:', probability[0])
print('ASD probability:', probability[0][1])
