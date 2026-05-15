import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomaly(file_path):
    try:
        df = pd.read_csv(file_path, names=["time", "cpu", "memory", "anomaly"])

        # Use last 50 records
        df = df.tail(50)

        # Use CPU + Memory as features
        X = df[["cpu", "memory"]]

        # Train model
        model = IsolationForest(contamination=0.1, random_state=42)
        model.fit(X)

        # Predict (-1 = anomaly, 1 = normal)
        prediction = model.predict(X)

        # Take latest prediction
        latest = prediction[-1]

        if latest == -1:
            return 1
        else:
            return 0

    except Exception as e:
        print("ML Error:", e)
        return 0