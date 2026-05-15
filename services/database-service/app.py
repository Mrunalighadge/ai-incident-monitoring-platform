from flask import Flask, Response
from flask_cors import CORS
import random
import psutil
from flask import Flask, Response, jsonify

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Database Service Running"

@app.route('/metrics')
def metrics():

    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent

    connections = random.randint(10, 100)
    latency = random.randint(50, 500)
    errors = random.randint(0, 10)

    data = f"""
# HELP db_cpu_usage CPU Usage
# TYPE db_cpu_usage gauge
db_cpu_usage {cpu}

# HELP db_memory_usage Memory Usage
# TYPE db_memory_usage gauge
db_memory_usage {memory}

# HELP db_connections Active DB Connections
# TYPE db_connections gauge
db_connections {connections}

# HELP query_latency Query Latency
# TYPE query_latency gauge
query_latency {latency}

# HELP db_errors Database Errors
# TYPE db_errors gauge
db_errors {errors}
"""

    return Response(data, mimetype="text/plain")
@app.route('/stats')
def stats():
    cpu = 31
    memory = 49

    return jsonify({
        "service": "Database Service",
        "status": "HEALTHY",
        "cpu": cpu,
        "memory": memory
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)