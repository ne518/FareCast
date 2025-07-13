from flask import Flask, request, jsonify
from sklearn.ensemble import GradientBoostingRegressor
import numpy as np
import joblib

app = Flask(__name__)
model = joblib.load("model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array([data[key] for key in sorted(data)]).reshape(1, -1)
    prediction = model.predict(features)[0]
    return jsonify({"predicted_price": round(prediction, 2)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
