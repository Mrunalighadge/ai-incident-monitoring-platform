import json
from flask import Flask, Response
from collections import Counter

app = Flask(__name__)

TRIVY_FILE = "trivy-report.json"

@app.route("/metrics")
def metrics():
    try:
        with open(TRIVY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        severity_counts = Counter()

        results = data.get("Results", [])

        for result in results:
            vulnerabilities = result.get("Vulnerabilities", [])

            for vuln in vulnerabilities:
                severity = vuln.get("Severity", "UNKNOWN")
                severity_counts[severity] += 1

        metrics_output = f"""
# HELP trivy_critical_vulnerabilities Critical vulnerabilities
# TYPE trivy_critical_vulnerabilities gauge
trivy_critical_vulnerabilities {severity_counts.get('CRITICAL', 0)}

# HELP trivy_high_vulnerabilities High vulnerabilities
# TYPE trivy_high_vulnerabilities gauge
trivy_high_vulnerabilities {severity_counts.get('HIGH', 0)}

# HELP trivy_medium_vulnerabilities Medium vulnerabilities
# TYPE trivy_medium_vulnerabilities gauge
trivy_medium_vulnerabilities {severity_counts.get('MEDIUM', 0)}

# HELP trivy_low_vulnerabilities Low vulnerabilities
# TYPE trivy_low_vulnerabilities gauge
trivy_low_vulnerabilities {severity_counts.get('LOW', 0)}
"""

        return Response(metrics_output, mimetype="text/plain")

    except Exception as e:
        return Response(str(e), mimetype="text/plain")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)