from flask import Flask, Response
from flask_cors import CORS
import random
import psutil
from flask import Flask, Response, jsonify

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Auth Service Running"

@app.route('/metrics')
def metrics():

    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent

    auth_failures = random.randint(0, 5)
    anomaly = random.randint(0, 1)

    data = f"""
# HELP auth_cpu_usage CPU Usage
# TYPE auth_cpu_usage gauge
auth_cpu_usage {cpu}

# HELP auth_memory_usage Memory Usage
# TYPE auth_memory_usage gauge
auth_memory_usage {memory}

# HELP auth_failures Authentication Failures
# TYPE auth_failures gauge
auth_failures {auth_failures}

# HELP anomaly AI Anomaly Detection
# TYPE anomaly gauge
anomaly {anomaly}
"""

    return Response(data, mimetype="text/plain")
@app.route('/stats')
def stats():
    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent

    return jsonify({
        "service": "Auth Service",
        "status": "HEALTHY",
        "cpu": cpu,
        "memory": memory
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)