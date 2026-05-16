from flask import Flask, Response
from flask_cors import CORS
import random
import psutil
from flask import Flask, Response, jsonify

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Notification Service Running"

@app.route('/metrics')
def metrics():

    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent

    queue = random.randint(1, 100)
    failures = random.randint(0, 10)

    data = f"""
# HELP notification_cpu_usage CPU Usage
# TYPE notification_cpu_usage gauge
notification_cpu_usage {cpu}

# HELP notification_memory_usage Memory Usage
# TYPE notification_memory_usage gauge
notification_memory_usage {memory}

# HELP email_queue Pending Emails
# TYPE email_queue gauge
email_queue {queue}

# HELP failed_notifications Failed Notifications
# TYPE failed_notifications gauge
failed_notifications {failures}
"""

    return Response(data, mimetype="text/plain")
@app.route('/stats')
def stats():
    cpu = 67
    memory = 58

    return jsonify({
        "service": "Notification Service",
        "status": "WARNING",
        "cpu": cpu,
        "memory": memory
    })
import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5003))
    app.run(host='0.0.0.0', port=port)
