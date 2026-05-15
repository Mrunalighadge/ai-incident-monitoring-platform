import pandas as pd
from sklearn.ensemble import IsolationForest

# Load data
df = pd.read_csv("app/data/metrics.csv", names=["timestamp", "cpu", "memory"])
# Convert timestamp
df["timestamp"] = pd.to_datetime(df["timestamp"])

# Use only numeric features
X = df[["cpu", "memory"]]

# Train model
model = IsolationForest(contamination=0.05)
df["anomaly"] = model.fit_predict(X)

# Convert output (-1 = anomaly)
df["anomaly"] = df["anomaly"].apply(lambda x: 1 if x == -1 else 0)

# Show anomalies
anomalies = df[df["anomaly"] == 1]

print("\n🚨 ANOMALIES DETECTED:\n")
print(anomalies.tail(10))