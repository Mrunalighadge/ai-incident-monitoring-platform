import pandas as pd

# Read CSV without headers
df = pd.read_csv(
    "metrics.csv",
    header=None
)

# Assign column names
df.columns = [
    "time",
    "cpu",
    "memory"
]

# Create incident labels
def create_label(row):

    cpu = float(row["cpu"])
    memory = float(row["memory"])

    if cpu > 85 or memory > 85:
        return "CRITICAL"

    elif cpu > 70 or memory > 70:
        return "WARNING"

    else:
        return "HEALTHY"

# Add new column
df["incident"] = df.apply(
    create_label,
    axis=1
)

# Save labeled dataset
df.to_csv(
    "labeled_metrics.csv",
    index=False
)

print("Dataset labeled successfully!")
print(df.head())