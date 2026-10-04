import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Load the dataset
data = pd.read_csv("fare_data.csv")

# 2. Input (distance) and output (fare)
X = data[["distance_km"]]
y = data["fare"]

# 3. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Create the ML model
model = LinearRegression()

# 5. Train the model
model.fit(X_train, y_train)

# 6. Predict fares for test data
predictions = model.predict(X_test)

# 7. Evaluate the model
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("Model trained successfully!")
print("Mean Absolute Error:", mae)
print("R2 Score:", r2)

# 8. Test the model with a new distance
distance = 15
predicted_fare = model.predict(
    pd.DataFrame([[distance]], columns=["distance_km"])
)

print("Predicted fare for", distance, "km:", round(predicted_fare[0], 2))
# Save the trained model
joblib.dump(model, "fare_model.pkl")

print("Model saved successfully!")