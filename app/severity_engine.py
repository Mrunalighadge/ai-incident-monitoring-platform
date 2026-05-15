def calculate_severity(cpu, memory, payment_failures, db_connections, anomaly):

    severity = 0

    # WARNING CONDITIONS
    if cpu > 70 or memory > 75:
        severity = 1

    if payment_failures > 3:
        severity = 1

    if db_connections > 80:
        severity = 1

    # CRITICAL CONDITIONS
    if payment_failures > 5 and db_connections > 90:
        severity = 2

    if anomaly == 1 and cpu > 85:
        severity = 2

    return severity