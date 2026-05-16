from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "AI Engine Running"

@app.route('/analysis')
def analysis():

    cpu = random.randint(1, 100)
    memory = random.randint(1, 100)
    queue = random.randint(1, 100)

    severity = "LOW"
    confidence = random.randint(80, 99)

    root_cause = "Infrastructure operating normally."
    recommendation = "No remediation required."

    resolution_steps = [
        "Continue monitoring system health."
    ]

    # PAYMENT CPU ISSUE
    if cpu > 85:

        severity = "CRITICAL"

        root_cause = (
            "Payment service overload caused by excessive CPU "
            "utilization and request saturation."
        )

        recommendation = (
            "Restart payment-service and scale replicas."
        )

        resolution_steps = [
            "Restart payment-service container",
            "Scale service replicas horizontally",
            "Investigate retry storm in API gateway",
            "Monitor queue latency and payment retries"
        ]

    # NOTIFICATION QUEUE ISSUE
    elif queue > 70:

        severity = "WARNING"

        root_cause = (
            "Notification queue buildup detected due to delayed "
            "message processing."
        )

        recommendation = (
            "Increase notification worker throughput."
        )

        resolution_steps = [
            "Restart notification-service",
            "Increase worker thread count",
            "Clear stuck notification jobs",
            "Verify SMTP provider health"
        ]

    # MEMORY ISSUE
    elif memory > 80:

        severity = "WARNING"

        root_cause = (
            "High memory consumption detected in infrastructure services."
        )

        recommendation = (
            "Investigate memory leaks and optimize workloads."
        )

        resolution_steps = [
            "Check container memory usage",
            "Investigate memory leaks",
            "Restart overloaded containers",
            "Optimize background processes"
        ]

    return jsonify({

        "severity": severity,
        "confidence": confidence,
        "root_cause": root_cause,
        "recommendation": recommendation,
        "resolution_steps": resolution_steps,

        "cpu": cpu,
        "memory": memory,
        "queue": queue
    })
import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5005))
    app.run(host='0.0.0.0', port=port)
