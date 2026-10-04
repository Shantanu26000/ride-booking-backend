from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained ML model
model = joblib.load("fare_model.pkl")


@app.route("/predict", methods=["POST"])
def predict_fare():
    data = request.get_json()

    distance = data.get("distance")

    if distance is None:
        return jsonify({
            "success": False,
            "message": "Distance is required"
        }), 400

    predicted_fare = model.predict([[distance]])[0]

    return jsonify({
        "success": True,
        "distance": distance,
        "predictedFare": round(float(predicted_fare), 2)
    })


if __name__ == "__main__":
    app.run(port=5001)