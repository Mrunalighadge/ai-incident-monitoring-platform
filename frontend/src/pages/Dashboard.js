import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [aiData, setAiData] = useState({

    severity: "LOW",
    confidence: 0,
    root_cause: "Waiting for AI response...",
    recommendation: "",
    resolution_steps: []

  });

  const [chartData, setChartData] = useState([]);

  const authMetricsUrl =
    "https://auth-service-4ji5.onrender.com/metrics";

  const paymentMetricsUrl =
    "https://payment-service-cqbe.onrender.com/metrics";

  const notificationMetricsUrl =
    "https://notification-service-c1gx.onrender.com/metrics";

  const databaseMetricsUrl =
    "https://database-service-1ys1.onrender.com/metrics";

  const aiEngineUrl =
    "https://ai-engine-hrd0.onrender.com/analysis";

  const parseMetric = (text, metricName) => {

    const regex = new RegExp(`${metricName} (\\d+\\.?\\d*)`);
    const match = text.match(regex);

    return match ? parseFloat(match[1]) : 0;

  };

  const getStatus = (cpu, memory) => {

    if (cpu > 85 || memory > 85) {
      return "CRITICAL";
    }

    if (cpu > 70 || memory > 70) {
      return "WARNING";
    }

    return "HEALTHY";

  };

  const updateChartData = (servicesData) => {

    const avgCpu =
      servicesData.reduce((acc, s) => acc + s.cpu, 0) /
      servicesData.length;

    const avgMemory =
      servicesData.reduce((acc, s) => acc + s.memory, 0) /
      servicesData.length;

    const time = new Date().toLocaleTimeString();

    setChartData((prev) => [

      ...prev.slice(-9),

      {
        time,
        cpu: avgCpu,
        memory: avgMemory,
      },

    ]);

  };

  const fetchMetrics = async () => {

    try {

      const [
        authRes,
        paymentRes,
        notificationRes,
        databaseRes
      ] = await Promise.all([

        fetch(authMetricsUrl),
        fetch(paymentMetricsUrl),
        fetch(notificationMetricsUrl),
        fetch(databaseMetricsUrl)

      ]);

      const authText = await authRes.text();
      const paymentText = await paymentRes.text();
      const notificationText = await notificationRes.text();
      const databaseText = await databaseRes.text();

      const serviceData = [

        {
          name: "Auth Service",
          cpu: parseMetric(authText, "auth_cpu_usage"),
          memory: parseMetric(authText, "auth_memory_usage"),
        },

        {
          name: "Payment Service",
          cpu: parseMetric(paymentText, "payment_cpu_usage"),
          memory: parseMetric(paymentText, "payment_memory_usage"),
        },

        {
          name: "Notification Service",
          cpu: parseMetric(notificationText, "notification_cpu_usage"),
          memory: parseMetric(notificationText, "notification_memory_usage"),
        },

        {
          name: "Database Service",
          cpu: parseMetric(databaseText, "db_cpu_usage"),
          memory: parseMetric(databaseText, "db_memory_usage"),
        },

      ].map((service) => ({

        ...service,
        status: getStatus(service.cpu, service.memory)

      }));

      setServices(serviceData);

      updateChartData(serviceData);

    } catch (error) {

      console.error("Error fetching metrics:", error);

    }

  };

  const fetchAIAnalysis = async () => {

    try {

      const response = await fetch(aiEngineUrl);

      const data = await response.json();

      setAiData(data);

    } catch (error) {

      console.error("AI Engine Error:", error);

    }

  };

  useEffect(() => {

    fetchMetrics();
    fetchAIAnalysis();

    const interval = setInterval(() => {

      fetchMetrics();
      fetchAIAnalysis();

    }, 5000);

    return () => clearInterval(interval);

  // eslint-disable-next-line
  }, []);

  const activeIncidents =
    services.filter((s) => s.status !== "HEALTHY");

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      {/* HEADER */}

      <div className="mb-10 text-center">

        <h1 className="text-5xl font-bold mb-3 text-cyan-400">

          Intelligent IT Incident Platform

        </h1>

        <p className="text-gray-400 text-lg">

          AI-Powered Observability & Incident Response Center

        </p>

      </div>

      {/* SERVICE CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {services.map((service, index) => (

          <div
            key={index}

            onClick={() => {

              if (service.name === "Payment Service")
                navigate("/payment-monitoring");

              if (service.name === "Database Service")
                navigate("/database-monitoring");

              if (service.name === "Notification Service")
                navigate("/notification-monitoring");

              if (service.name === "Auth Service")
                navigate("/auth-monitoring");

            }}

            className={`cursor-pointer rounded-3xl border p-6 shadow-xl transition-all duration-300 hover:scale-105
            ${
              service.status === "CRITICAL"
                ? "border-red-500 shadow-red-500/20"
                : service.status === "WARNING"
                ? "border-yellow-500 shadow-yellow-500/20"
                : "border-cyan-400 shadow-cyan-500/10"
            }
            bg-[#0f172a]
            `}
          >

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">

                {service.name}

              </h2>

              <div
                className={`w-4 h-4 rounded-full
                ${
                  service.status === "CRITICAL"
                    ? "bg-red-500"
                    : service.status === "WARNING"
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }
                `}
              />

            </div>

            <div className="mb-5">

              <p className="text-gray-400 text-sm mb-1">

                Status

              </p>

              <p
                className={`font-bold text-3xl
                ${
                  service.status === "CRITICAL"
                    ? "text-red-400"
                    : service.status === "WARNING"
                    ? "text-yellow-300"
                    : "text-green-400"
                }
                `}
              >

                {service.status}

              </p>

            </div>

            {/* CPU */}

            <div className="mb-4">

              <div className="flex justify-between text-sm mb-2">

                <span>CPU Usage</span>

                <span>{service.cpu.toFixed(0)}%</span>

              </div>

              <div className="w-full bg-slate-600 rounded-full h-3">

                <div
                  className={`h-3 rounded-full
                  ${
                    service.cpu > 85
                      ? "bg-red-500"
                      : service.cpu > 70
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }
                  `}
                  style={{ width: `${service.cpu}%` }}
                />

              </div>

            </div>

            {/* MEMORY */}

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span>Memory Usage</span>

                <span>{service.memory.toFixed(0)}%</span>

              </div>

              <div className="w-full bg-slate-600 rounded-full h-3">

                <div
                  className={`h-3 rounded-full
                  ${
                    service.memory > 85
                      ? "bg-red-500"
                      : service.memory > 70
                      ? "bg-yellow-400"
                      : "bg-cyan-400"
                  }
                  `}
                  style={{ width: `${service.memory}%` }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* MAIN SECTION */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* ACTIVE INCIDENTS + CHART */}

        <div className="lg:col-span-2 bg-[#0f172a] rounded-3xl p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-4xl font-bold">

              Active Incidents

            </h2>

            <span className="text-red-400 animate-pulse">

              LIVE

            </span>

          </div>

          <div className="space-y-6">

            {/* INCIDENTS */}

            <div className="space-y-4">

              {activeIncidents.length === 0 ? (

                <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6 text-center">

                  <h3 className="text-2xl font-bold text-green-400 mb-2">

                    No Active Incidents

                  </h3>

                  <p className="text-gray-300">

                    All infrastructure services are operating normally.

                  </p>

                </div>

              ) : (

                activeIncidents.map((service, index) => (

                  <div
                    key={index}
                    className="bg-slate-700 rounded-2xl p-5 flex justify-between items-center"
                  >

                    <div>

                      <h3 className="font-bold text-lg">

                        {service.name} issue detected

                      </h3>

                      <p className="text-gray-400">

                        CPU: {service.cpu.toFixed(0)}% |
                        Memory: {service.memory.toFixed(0)}%

                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-full font-bold
                      ${
                        service.status === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-300"
                      }
                      `}
                    >

                      {service.status}

                    </span>

                  </div>

                ))

              )}

            </div>

            {/* LIVE CHART */}

            <div className="bg-[#111827] rounded-2xl p-4 h-[280px]">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-xl font-bold">

                  Infrastructure Health Trends

                </h3>

                <span className="text-cyan-400 text-sm">

                  REAL-TIME

                </span>

              </div>

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                  />

                  <YAxis stroke="#9CA3AF" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="memory"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* AI ANALYSIS */}

        <div className="bg-[#0f172a] rounded-3xl p-6">

          <h2 className="text-4xl font-bold mb-6">

            AI Incident Analysis

          </h2>

          <div className="bg-slate-700 rounded-2xl p-5">

            <p className="text-gray-400 text-sm mb-2">

              Root Cause Prediction

            </p>

            <h3 className="text-3xl font-bold text-red-400 mb-5">

              {aiData.root_cause}

            </h3>

            <p className="text-gray-200 mb-6">

              {aiData.recommendation}

            </p>

            <div className="mb-6">

              <div className="flex justify-between mb-2">

                <span className="text-gray-400">

                  Confidence

                </span>

                <span className="font-bold">

                  {aiData.confidence}%

                </span>

              </div>

              <div className="w-full bg-slate-600 rounded-full h-4">

                <div
                  className="bg-red-400 h-4 rounded-full"
                  style={{
                    width: `${aiData.confidence}%`
                  }}
                />

              </div>

            </div>

            <div>

              <h4 className="text-gray-300 mb-4">

                Resolution Steps

              </h4>

              <div className="space-y-3">

                {aiData.resolution_steps?.map((step, index) => (

                  <div
                    key={index}
                    className="bg-slate-800 rounded-xl p-3"
                  >

                    {index + 1}. {step}

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SYSTEM STATUS */}

      <div className="bg-[#0f172a] rounded-3xl p-6">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-4xl font-bold">

            System Status

          </h2>

          <span className="text-green-400 font-bold">

            Operational

          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <div className="bg-slate-700 rounded-2xl p-6 text-center">

            <p className="text-gray-400 mb-3">

              Services Running

            </p>

            <h3 className="text-5xl font-bold">

              {services.length}

            </h3>

          </div>

          <div className="bg-slate-700 rounded-2xl p-6 text-center">

            <p className="text-gray-400 mb-3">

              Firing Alerts

            </p>

            <h3 className="text-5xl font-bold text-red-400">

              {activeIncidents.length}

            </h3>

          </div>

          <div className="bg-slate-700 rounded-2xl p-6 text-center">

            <p className="text-gray-400 mb-3">

              AI Severity

            </p>

            <h3
              className={`text-4xl font-bold
              ${
                aiData.severity === "CRITICAL"
                  ? "text-red-400"
                  : aiData.severity === "WARNING"
                  ? "text-yellow-300"
                  : "text-green-400"
              }
              `}
            >

              {aiData.severity}

            </h3>

          </div>

          <div className="bg-slate-700 rounded-2xl p-6 text-center">

            <p className="text-gray-400 mb-3">

              AI Confidence

            </p>

            <h3 className="text-5xl font-bold text-cyan-400">

              {aiData.confidence}%

            </h3>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;