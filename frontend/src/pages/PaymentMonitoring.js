import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { useNavigate } from "react-router-dom";

function PaymentMonitoring() {

  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);

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
        "https://payment-service-cqbe.onrender.com"
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

      const timestamp =
        new Date().toLocaleTimeString();

      setChartData((prev) => [

        ...prev.slice(-14),

        {
          time: timestamp,
          cpu,
          memory
        }

      ]);

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

        {/* REAL-TIME CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* CPU CHART */}

          <div className="bg-slate-900 rounded-3xl p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                CPU Trend
              </h2>

              <span className="text-red-400 animate-pulse">
                LIVE
              </span>

            </div>

            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                  />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* MEMORY CHART */}

          <div className="bg-slate-900 rounded-3xl p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Memory Trend
              </h2>

              <span className="text-cyan-400 animate-pulse">
                LIVE
              </span>

            </div>

            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                  />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#06b6d4"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

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