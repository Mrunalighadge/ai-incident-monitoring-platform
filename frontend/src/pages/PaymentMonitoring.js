import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function PaymentMonitoring() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
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
        "https://payment-service-n9ds.onrender.com/metrics"
      );

      const text = await response.text();

      const parseMetric = (metric) => {

        const regex = new RegExp(
          `${metric}\\s+(\\d+\\.?\\d*)`
        );

        const match = text.match(regex);

        return match ? parseFloat(match[1]) : 0;

      };

      const cpu = parseMetric("payment_cpu_usage");

      const memory = parseMetric(
        "payment_memory_usage"
      );

      const status =
        cpu > 80
          ? "CRITICAL"
          : cpu > 60
          ? "WARNING"
          : "HEALTHY";

      setStats({
        cpu,
        memory,
        status
      });

    } catch (error) {

      console.error(
        "Payment metrics failed:",
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

              Payment Service Monitoring

            </h1>

            <p className="text-gray-400 text-lg">

              Real-time observability and
              payment infrastructure analytics

            </p>

          </div>

          <div className="bg-slate-900 border border-red-500 rounded-2xl px-8 py-5">

            <p className="text-red-400 text-sm uppercase">

              Service Status

            </p>

            <h2
              className={`text-4xl font-bold ${getStatusColor()}`}
            >

              {stats.status}

            </h2>

          </div>

        </div>

        {/* METRIC CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* CPU */}

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700">

            <p className="text-gray-400 mb-3">
              CPU Usage
            </p>

            <h2 className="text-5xl font-bold text-red-400 mb-4">

              {stats.cpu.toFixed(0)}%

            </h2>

            <div className="w-full bg-slate-700 rounded-full h-4">

              <div
                className="bg-red-500 h-4 rounded-full"

                style={{
                  width: `${stats.cpu}%`
                }}
              ></div>

            </div>

          </div>

          {/* MEMORY */}

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700">

            <p className="text-gray-400 mb-3">
              Memory Usage
            </p>

            <h2 className="text-5xl font-bold text-cyan-400 mb-4">

              {stats.memory.toFixed(0)}%

            </h2>

            <div className="w-full bg-slate-700 rounded-full h-4">

              <div
                className="bg-cyan-400 h-4 rounded-full"

                style={{
                  width: `${stats.memory}%`
                }}
              ></div>

            </div>

          </div>

        </div>

        {/* PAYMENT CHARTS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

  {/* PAYMENT DASHBOARD */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Payment Analytics Dashboard
      </h2>

      <a
        href="https://rubyplatypus1017.grafana.net/d/mrn9gpw/payment-dashboard"
        target="_blank"
        rel="noreferrer"
        className="text-cyan-400 hover:text-cyan-300"
      >
        Open Grafana →
      </a>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">💳</div>

      <h3 className="text-xl font-semibold mb-3">
        Payment Monitoring Dashboard
      </h3>

      <p className="text-gray-400 text-center px-6 mb-6">
        View payment CPU usage, memory usage,
        transaction monitoring and service analytics
        in Grafana.
      </p>

      <a
        href="https://rubyplatypus1017.grafana.net/d/mrn9gpw/payment-dashboard"
        target="_blank"
        rel="noreferrer"
        className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl"
      >
        View Dashboard
      </a>

    </div>

  </div>

  {/* PAYMENT AI ANALYSIS */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Payment AI Analysis
      </h2>

      <span className="text-red-400 animate-pulse">
        LIVE
      </span>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">📈</div>

      <h3 className="text-xl font-semibold mb-3">
        Transaction Risk Analysis
      </h3>

      <p className="text-gray-400 text-center px-6 mb-4">
        Current payment anomaly score:
      </p>

      <div className="text-5xl font-bold text-red-400 mb-4">
        {stats.anomalies}
      </div>

      <p className="text-green-400">
        Payment system operating normally
      </p>

    </div>

  </div>

</div>

        {/* INCIDENT ANALYSIS */}

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-3xl font-bold mb-6">

            Payment Incident Insights

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Incident Severity
              </p>

              <h3 className="text-4xl font-bold text-red-400">

                {stats.status}

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Predicted Root Cause
              </p>

              <h3 className="text-lg font-semibold">

                CPU saturation caused by
                excessive payment retries

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Recommended Action
              </p>

              <h3 className="text-lg font-semibold">

                Scale replicas and restart
                overloaded containers

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default PaymentMonitoring;