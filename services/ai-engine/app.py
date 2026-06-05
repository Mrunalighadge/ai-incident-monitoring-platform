from flask import Flask, jsonify, Response
from flask_cors import CORS
from prometheus_client import Gauge, generate_latest
import requests
import re
import os
from flask import request

app = Flask(__name__)
CORS(app)

# Prometheus Metrics
cpu_usage = Gauge('ai_cpu_usage', 'AI Engine CPU Usage')
memory_usage = Gauge('ai_memory_usage', 'AI Engine Memory Usage')


@app.route("/")
def home():
    return jsonify({
        "root_cause": "Infrastructure operating normally",
        "confidence_score": 94,
        "recommendation": "No action required",
        "resolution_steps": "Continue monitoring services"
    })


@app.route("/metrics")
def metrics():

    cpu_usage.set(35)
    memory_usage.set(60)

    return Response(
        generate_latest(),
        mimetype="text/plain"
    )


@app.route("/analysis")
def analysis():

    try:

        auth_metrics = requests.get(
            "https://auth-service-opu2.onrender.com/metrics"
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
    
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        question = data.get("question", "").lower()

        response = (
            "I can help with Auth, Payment, Notification, "
            "Database and Infrastructure incidents."
        )

        if "payment" in question:

            response = (
                "Payment service handles transactions. "
                "Check CPU usage, memory consumption and "
                "transaction processing spikes in Grafana."
            )

        elif "auth" in question:

            response = (
                "Authentication service validates users "
                "and tokens. Investigate login failures "
                "and CPU pressure if issues occur."
            )

        elif "database" in question:

            response = (
                "Database health depends on query latency, "
                "connections and CPU utilization. "
                "Investigate slow queries first."
            )

        elif "notification" in question:

            response = (
                "Notification service manages email delivery. "
                "Monitor queue size and failed notifications."
            )

        elif "critical" in question:

            response = (
                "Critical incidents require immediate action. "
                "Review Grafana dashboards and AI recommendations."
            )

        elif "healthy" in question:

            response = (
                "All monitored services appear healthy based "
                "on current metrics."
            )

        return jsonify({
            "answer": response
        })
    except Exception as e:
       return jsonify({
            "answer": str(e)
        })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )