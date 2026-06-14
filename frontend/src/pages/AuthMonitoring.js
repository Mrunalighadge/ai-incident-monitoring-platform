import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function AuthMonitoring() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    authFailures: 0,
    anomalies: 0,
    status: "HEALTHY"
  });

  useEffect(() => {

    fetchMetrics();

    const interval = setInterval(() => {

      fetchMetrics();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchMetrics = async () => {

    try {

      const response = await fetch(
         "https://auth-service-1zh0.onrender.com/metrics"

      );

      const text = await response.text();

      const parseMetric = (metric) => {

        const regex = new RegExp(
          `${metric}\\s+(\\d+\\.?\\d*)`
        );

        const match = text.match(regex);

        return match ? parseFloat(match[1]) : 0;

      };

      const cpu = parseMetric(
        "auth_cpu_usage"
      );

      const memory = parseMetric(
        "auth_memory_usage"
      );

      const authFailures = parseMetric(
        "auth_failures"
      );

      const anomalies = parseMetric(
        "anomaly"
      );

      const status =
        authFailures > 5
          ? "CRITICAL"
          : anomalies > 60
          ? "WARNING"
          : "HEALTHY";

      setStats({
        cpu,
        memory,
        authFailures,
        anomalies,
        status
      });
    } catch (error) {

      console.error(
        "Auth metrics failed:",
        error
      );

    }

  };

  const getStatusColor = () => {

    if (stats.status === "CRITICAL")
      return "text-red-400";

    if (stats.status === "WARNING")
      return "text-yellow-400";

    return "text-green-400";

  };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <button
              onClick={() => navigate("/")}

              className="mb-5 bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-5xl font-bold mb-3">

              Authentication Monitoring

            </h1>

            <p className="text-gray-400 text-lg">

              Security analytics and authentication observability

            </p>

          </div>

          <div className="bg-slate-900 border border-red-500 rounded-2xl px-8 py-5">

            <p className="text-red-400 text-sm uppercase">

              Auth Status

            </p>

            <h2
              className={`text-4xl font-bold ${getStatusColor()}`}
            >

              {stats.status}

            </h2>

          </div>

        </div>

        {/* METRIC CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-900 rounded-3xl p-6">

            <p className="text-gray-400 mb-2">
              CPU Usage
            </p>

            <h2 className="text-4xl font-bold text-red-400">

              {stats.cpu.toFixed(0)}%

            </h2>

          </div>

          <div className="bg-slate-900 rounded-3xl p-6">

            <p className="text-gray-400 mb-2">
              Memory Usage
            </p>

            <h2 className="text-4xl font-bold text-cyan-400">

              {stats.memory.toFixed(0)}%

            </h2>

          </div>

          <div className="bg-slate-900 rounded-3xl p-6">

            <p className="text-gray-400 mb-2">
              Auth Failures
            </p>

            <h2 className="text-4xl font-bold text-red-400">

              {stats.authFailures.toFixed(0)}

            </h2>

          </div>

          <div className="bg-slate-900 rounded-3xl p-6">

            <p className="text-gray-400 mb-2">
              Anomaly Score
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">

              {stats.anomalies.toFixed(0)}

            </h2>

          </div>

        </div>

        {/* CHARTS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

  {/* AUTH FAILURE TREND */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Authentication Failure Trend
      </h2>

      <a
        href="https://rubyplatypus1017.grafana.net/d/mrs9w95/auth-dashboard"
        target="_blank"
        rel="noreferrer"
        className="text-cyan-400 hover:text-cyan-300"
      >
        Open Grafana →
      </a>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">📊</div>

      <h3 className="text-xl font-semibold mb-3">
        Authentication Monitoring Dashboard
      </h3>

      <p className="text-gray-400 text-center px-6 mb-6">
        View detailed authentication failure trends,
        CPU usage, memory usage and security analytics
        in Grafana.
      </p>

      <a
        href="https://rubyplatypus1017.grafana.net/d/mrs9w95/auth-dashboard"
        target="_blank"
        rel="noreferrer"
        className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl"
      >
        View Dashboard
      </a>

    </div>

  </div>

  {/* SECURITY ANOMALY TREND */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Security Anomaly Trend
      </h2>

      <span className="text-yellow-400 animate-pulse">
        LIVE
      </span>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">🛡️</div>

      <h3 className="text-xl font-semibold mb-3">
        AI Security Analysis
      </h3>

      <p className="text-gray-400 text-center px-6 mb-4">
        Current anomaly score:
      </p>

      <div className="text-5xl font-bold text-yellow-400 mb-4">
        {stats.anomalies}
      </div>

      <p className="text-green-400">
        System operating normally
      </p>

    </div>

  </div>

</div>

        {/* SECURITY INSIGHTS */}

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-3xl font-bold mb-6">

            Authentication Security Insights

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Predicted Threat
              </p>

              <h3 className="text-lg font-semibold">

                Suspicious authentication attempts detected

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Impact Analysis
              </p>

              <h3 className="text-lg font-semibold">

                Increased failed logins and token validation pressure

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Recommended Action
              </p>

              <h3 className="text-lg font-semibold">

                Enable rate limiting and investigate suspicious IP traffic

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AuthMonitoring;