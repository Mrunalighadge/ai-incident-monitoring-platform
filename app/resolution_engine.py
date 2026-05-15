def get_resolution(cpu, memory):
    
    if cpu > 80:
        return "High CPU usage detected. Try restarting heavy processes or scaling system."

    elif memory > 85:
        return "High Memory usage detected. Clear cache or restart application."

    elif cpu > 60:
        return "Moderate CPU usage. Monitor background processes."

    elif memory > 70:
        return "Memory usage increasing. Consider freeing unused memory."

    else:
        return "System stable. No action needed."