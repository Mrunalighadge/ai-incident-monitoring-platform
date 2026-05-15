from flask import Flask, Response
import psutil
import random
import datetime
import smtplib
from email.mime.text import MIMEText

from detect_anomaly import detect_anomaly
from severity_engine import calculate_severity

app = Flask(__name__)

last_email_time = None


# ---------------- HOME ----------------
@app.route('/')
def home():
    return "Intelligent Incident Monitoring System Running!"


# ---------------- LOAD GENERATOR ----------------
@app.route('/load')
def load():

    x = []

    for i in range(1000000):
        x.append(i * i)

    return "CPU Load Generated!"


# ---------------- METRICS ----------------
@app.route('/metrics')
def metrics():

    global last_email_time

    # System Metrics
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent

    # Simulated Metrics
    payment_failures = random.randint(0, 10)
    db_connections = random.randint(40, 100)
    notification_queue = random.randint(0, 50)
    db_query_latency = round(random.uniform(0.1, 3.0), 2)

    # Save Metrics
    with open("data/metrics.csv", "a") as f:
        f.write(
            f"{datetime.datetime.now()},"
            f"{cpu},"
            f"{memory},"
            f"{payment_failures},"
            f"{db_connections}\n"
        )

    # AI Anomaly Detection
    anomaly = detect_anomaly("data/metrics.csv")

    # Dynamic Severity Calculation
    severity = calculate_severity(
        cpu,
        memory,
        payment_failures,
        db_connections,
        anomaly
    )

    # ---------------- AUTO RESOLUTION ----------------
    resolution = "System Normal"

    if severity == 1:
        resolution = "Restart recommended for overloaded service"

    elif severity == 2:
        resolution = "CRITICAL: Scale containers and restart DB service immediately"

    # ---------------- EMAIL ALERT ----------------
    try:

        if severity >= 1:

            now = datetime.datetime.now()

            # Prevent mail spam (1 min cooldown)
            if (
                last_email_time is None
                or (now - last_email_time).seconds > 60
            ):

                sender_email = "mrunalighadge070@gmail.com"
                app_password = "YOUR_APP_PASSWORD"

                receiver_email = "mrunalighadge070@gmail.com"

                subject = f"INCIDENT ALERT - Severity {severity}"

                body = f"""
Incident Detected!

CPU Usage: {cpu}%
Memory Usage: {memory}%

Payment Failures: {payment_failures}
DB Connections: {db_connections}

Anomaly Detection: {anomaly}

Severity Level: {severity}

Suggested Resolution:
{resolution}
"""

                msg = MIMEText(body)

                msg["Subject"] = subject
                msg["From"] = sender_email
                msg["To"] = receiver_email

                server = smtplib.SMTP("smtp.gmail.com", 587)
                server.starttls()

                server.login(sender_email, app_password)

                server.sendmail(
                    sender_email,
                    receiver_email,
                    msg.as_string()
                )

                server.quit()

                print("Alert Email Sent!")

                last_email_time = now

    except Exception as e:
        print("Email Error:", e)

    # ---------------- PROMETHEUS METRICS ----------------
    data = f"""
# HELP cpu_usage CPU Usage
# TYPE cpu_usage gauge
cpu_usage {cpu}

# HELP memory_usage Memory Usage
# TYPE memory_usage gauge
memory_usage {memory}

# HELP anomaly AI Anomaly Detection
# TYPE anomaly gauge
anomaly {anomaly}

# HELP severity Incident Severity
# TYPE severity gauge
severity {severity}

# HELP payment_failures Payment Failures
# TYPE payment_failures gauge
payment_failures {payment_failures}

# HELP db_connections Database Connections
# TYPE db_connections gauge
db_connections {db_connections}

# HELP notification_queue Notification Queue
# TYPE notification_queue gauge
notification_queue {notification_queue}

# HELP db_query_latency DB Query Latency
# TYPE db_query_latency gauge
db_query_latency {db_query_latency}
"""

    return Response(data, mimetype="text/plain")


# ---------------- MAIN ----------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)