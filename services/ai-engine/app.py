from flask import Flask, jsonify
from flask_cors import CORS
import requests
import re

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "AI Engine Running"


@app.route('/analysis')
def analysis():

    try:

        auth_metrics = requests.get(
            "https://auth-service-4ji5.onrender.com/metrics"
        ).text

        payment_metrics = requests.get(
            "https://payment-service-cqbe.onrender.com/metrics"
        ).text

        notification_metrics = requests.get(
            "https://notification-service-c1gx.onrender.com/metrics"
        ).text

        database_metrics = requests.get(
            "https://database-service-1ys1.onrender.com/metrics"
        ).text

        def extract_metric(text, metric):

            match = re.search(
                rf"{metric}\s+(\d+\.?\d*)",
                text
            )

            if match:
                return float(match.group(1))

            return 0

        auth_cpu = extract_metric(
            auth_metrics,
            "auth_cpu_usage"
        )

        payment_cpu = extract_metric(
            payment_metrics,
            "payment_cpu_usage"
        )

        notification_cpu = extract_metric(
            notification_metrics,
            "notification_cpu_usage"
        )

        db_cpu = extract_metric(
            database_metrics,
            "db_cpu_usage"
        )

        severity = "LOW"
        confidence = 88

        root_cause = (
            "Infrastructure operating normally."
        )

        recommendation = (
            "No remediation required."
        )

        resolution_steps = [
            "Continue monitoring system health."
        ]

        # PAYMENT INCIDENT

        if payment_cpu > 85:

            severity = "CRITICAL"
            confidence = 97

            root_cause = (
                "Payment service overload detected due to "
                "extreme CPU utilization."
            )

            recommendation = (
                "Scale payment replicas and investigate "
                "transaction spikes."
            )

            resolution_steps = [
                "Restart payment-service",
                "Scale replicas horizontally",
                "Check API retry storms",
                "Investigate transaction queue latency"
            ]

        # AUTH INCIDENT

        elif auth_cpu > 80:

            severity = "WARNING"
            confidence = 92

            root_cause = (
                "Authentication service experiencing "
                "high CPU pressure."
            )

            recommendation = (
                "Optimize authentication workload."
            )

            resolution_steps = [
                "Inspect failed login bursts",
                "Restart auth-service",
                "Investigate token validation load"
            ]

        # NOTIFICATION INCIDENT

        elif notification_cpu > 70:

            severity = "WARNING"
            confidence = 90

            root_cause = (
                "Notification processing backlog detected."
            )

            recommendation = (
                "Increase notification worker throughput."
            )

            resolution_steps = [
                "Restart notification-service",
                "Scale worker threads",
                "Check SMTP provider health"
            ]

        # DATABASE INCIDENT

        elif db_cpu > 75:

            severity = "CRITICAL"
            confidence = 95

            root_cause = (
                "Database resource saturation detected."
            )

            recommendation = (
                "Optimize queries and scale database resources."
            )

            resolution_steps = [
                "Check slow queries",
                "Inspect DB locks",
                "Scale DB resources",
                "Restart database-service"
            ]

        return jsonify({

            "severity": severity,
            "confidence": confidence,
            "root_cause": root_cause,
            "recommendation": recommendation,
            "resolution_steps": resolution_steps

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })


import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )