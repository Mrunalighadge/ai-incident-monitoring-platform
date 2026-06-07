import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Load dataset
df = pd.read_csv("labeled_metrics.csv")

# Features
X = df[["cpu", "memory"]]

# Target
y = df["incident"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Predictions
predictions = model.predict(X_test)

print("\nModel Evaluation:\n")
print(classification_report(y_test, predictions))

# Save model
joblib.dump(
    model,
    "incident_model.pkl"
)

print("\nModel saved as incident_model.pkl")