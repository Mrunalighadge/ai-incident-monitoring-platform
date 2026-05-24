from flask import Flask, Response
import random
import psutil
from flask_cors import CORS
from flask import Flask, Response, jsonify

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Payment Service Running"

@app.route('/metrics')
def metrics():


    memory = psutil.virtual_memory().percent

    cpu=95

    payment_failures = random.randint(0, 5)

    data = f"""
payment_cpu_usage {cpu}
payment_memory_usage {memory}
payment_failures {payment_failures}

payment_critical_vulns 1
payment_high_vulns 3
payment_medium_vulns 8
payment_risk_score 78
"""

    return Response(data, mimetype="text/plain")
@app.route('/stats')
def stats():
    memory = psutil.virtual_memory().percent

    cpu = 95

    return jsonify({
        "service": "Payment Service",
        "status": "CRITICAL",
        "cpu": cpu,
        "memory": memory
    })
import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5002))
    app.run(host='0.0.0.0', port=port)


