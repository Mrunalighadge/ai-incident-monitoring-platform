import React, { useEffect, useState } from "react";


import { useNavigate } from "react-router-dom";

function DatabaseMonitoring() {

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    latency: 0,
    connections: 0,
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
        "https://database-service-1ys1.onrender.com/metrics"
      );

      const text = await response.text();

      const parseMetric = (metric) => {

        const regex = new RegExp(
          `${metric}\\s+(\\d+\\.?\\d*)`
        );

        const match = text.match(regex);

        return match ? parseFloat(match[1]) : 0;

      };

      const cpu = parseMetric("db_cpu_usage");

      const memory = parseMetric(
        "db_memory_usage"
      );

      const latency = parseMetric(
        "query_latency"
      );

      const connections = parseMetric(
        "db_connections"
      );

      const status =
        latency > 300
          ? "CRITICAL"
          : latency > 200
          ? "WARNING"
          : "HEALTHY";

      setStats({
        cpu,
        memory,
        latency,
        connections,
        status
      });

    } catch (error) {

      console.error(
        "Database metrics failed:",
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

              Database Monitoring

            </h1>

            <p className="text-gray-400 text-lg">

              Query latency and infrastructure analytics

            </p>

          </div>

          <div className="bg-slate-900 border border-red-500 rounded-2xl px-8 py-5">

            <p className="text-red-400 text-sm uppercase">

              Database Status

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
              Query Latency
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">

              {stats.latency.toFixed(0)} ms

            </h2>

          </div>

          <div className="bg-slate-900 rounded-3xl p-6">

            <p className="text-gray-400 mb-2">
              DB Connections
            </p>

            <h2 className="text-4xl font-bold text-green-400">

              {stats.connections.toFixed(0)}

            </h2>

          </div>

        </div>

        {/* DATABASE CHARTS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

  {/* DATABASE DASHBOARD */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Database Analytics Dashboard
      </h2>

      <a
        href="https://rubyplatypus1017.grafana.net/d/mrr9bq8/database-dashboard"
        target="_blank"
        rel="noreferrer"
        className="text-cyan-400 hover:text-cyan-300"
      >
        Open Grafana →
      </a>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">🗄️</div>

      <h3 className="text-xl font-semibold mb-3">
        Database Monitoring Dashboard
      </h3>

      <p className="text-gray-400 text-center px-6 mb-6">
        View database CPU usage, memory usage,
        storage monitoring and performance analytics
        in Grafana.
      </p>

      <a
        href="https://rubyplatypus1017.grafana.net/d/mrr9bq8/database-dashboard"
        target="_blank"
        rel="noreferrer"
        className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl"
      >
        View Dashboard
      </a>

    </div>

  </div>

  {/* DATABASE AI ANALYSIS */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Database AI Analysis
      </h2>

      <span className="text-green-400">
        LIVE
      </span>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">📊</div>

      <h3 className="text-xl font-semibold mb-3">
        Database Performance Analysis
      </h3>

      <p className="text-gray-400 text-center px-6 mb-4">
  Current Query Latency
</p>

<div className="text-5xl font-bold text-yellow-400 mb-4">
  {stats.latency.toFixed(0)} ms
</div>

<p
  className={
    stats.status === "CRITICAL"
      ? "text-red-400"
      : stats.status === "WARNING"
      ? "text-yellow-400"
      : "text-green-400"
  }
>
  {stats.status === "CRITICAL"
    ? "Database performance degraded"
    : stats.status === "WARNING"
    ? "Latency increasing"
    : "Database operating normally"}
</p>

    </div>

  </div>

</div>

        {/* AI INSIGHTS */}

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-3xl font-bold mb-6">

            Database Incident Insights

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Predicted Issue
              </p>

              <h3 className="text-lg font-semibold">

                Slow query execution causing latency spikes

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Impact Analysis
              </p>

              <h3 className="text-lg font-semibold">

                Payment processing delays and queue buildup

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Recommended Action
              </p>

              <h3 className="text-lg font-semibold">

                Optimize slow queries and scale DB pool

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default DatabaseMonitoring;