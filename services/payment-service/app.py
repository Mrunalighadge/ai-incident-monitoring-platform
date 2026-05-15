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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
