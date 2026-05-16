import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {

    fetchMetrics();
    fetchAIAnalysis();

    const interval = setInterval(() => {

      fetchMetrics();
      fetchAIAnalysis();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchMetrics = async () => {

    try {

      const auth = await fetch(
        "https://auth-service-4ji5.onrender.com/metrics"
      );

      const payment = await fetch(
        "https://payment-service-cqbe.onrender.com/metrics"
      );

      const notification = await fetch(
        "https://notification-service-c1gx.onrender.com/metrics"
      );

      const database = await fetch(
        "https://database-service-1ys1.onrender.com/metrics"
      );

      const authText = await auth.text();
      const paymentText = await payment.text();
      const notificationText = await notification.text();
      const databaseText = await database.text();

      const parseMetric = (text, metric) => {

        const regex = new RegExp(
          `${metric}\\s+(\\d+\\.?\\d*)`
        );

        const match = text.match(regex);

        return match ? parseFloat(match[1]) : 0;

      };

      const serviceData = [

        {
          name: "Auth Service",
          cpu: parseMetric(authText, "auth_cpu_usage"),
          memory: parseMetric(authText, "auth_memory_usage"),
          status:
            parseMetric(authText, "auth_cpu_usage") > 80
              ? "CRITICAL"
              : "HEALTHY",
        },

        {
          name: "Payment Service",
          cpu: parseMetric(paymentText, "payment_cpu_usage"),
          memory: parseMetric(paymentText, "payment_memory_usage"),
          status:
            parseMetric(paymentText, "payment_cpu_usage") > 80
              ? "CRITICAL"
              : "HEALTHY",
        },

        {
          name: "Notification Service",
          cpu: parseMetric(notificationText, "notification_cpu_usage"),
          memory: parseMetric(notificationText, "notification_memory_usage"),
          status:
            parseMetric(notificationText, "notification_cpu_usage") > 60
              ? "WARNING"
              : "HEALTHY",
        },

        {
          name: "Database Service",
          cpu: parseMetric(databaseText, "db_cpu_usage"),
          memory: parseMetric(databaseText, "db_memory_usage"),
          status:
            parseMetric(databaseText, "db_cpu_usage") > 75
              ? "WARNING"
              : "HEALTHY",
        },

      ];

      setServices(serviceData);

    } catch (error) {

      console.error("Metrics fetch failed:", error);

    }

  };

  const fetchAIAnalysis = async () => {

    try {

      const response = await fetch(
        "https://ai-engine-hrd0.onrender.com/analysis"
      );

      const data = await response.json();

      setAiAnalysis(data);

    } catch (error) {

      console.error("AI analysis failed:", error);

    }

  };

  const getBorderColor = (status) => {

    if (status === "CRITICAL")
      return "border-red-500 shadow-red-500/30";

    if (status === "WARNING")
      return "border-yellow-500 shadow-yellow-500/30";

    return "border-cyan-400 shadow-cyan-400/20";

  };

  const getStatusColor = (status) => {

    if (status === "CRITICAL")
      return "text-red-400";

    if (status === "WARNING")
      return "text-yellow-400";

    return "text-green-400";

  };

  const activeIncidents = services.filter(
    (service) => service.status !== "HEALTHY"
  ).length;

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-start mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-3">
              Intelligent Incident Monitoring Platform
            </h1>

            <p className="text-gray-400 text-lg">
              AI-Powered Observability & Incident Response Center
            </p>

          </div>

          <div className="bg-[#111827] border border-red-500 rounded-2xl px-8 py-5">

            <p className="text-red-400 text-sm uppercase">
              Active Incidents
            </p>

            <h2 className="text-5xl font-bold text-white">
              {activeIncidents}
            </h2>

          </div>

        </div>

        {/* SERVICES */}

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

              className={`cursor-pointer bg-[#0f172a] rounded-3xl p-6 border ${getBorderColor(
                service.status
              )} shadow-2xl hover:scale-105 transition duration-300`}
            >

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                  {service.name}
                </h2>

                <div className="w-4 h-4 rounded-full bg-green-400"></div>

              </div>

              <div className="space-y-5">

                <div>

                  <p className="text-gray-400 text-sm">
                    Status
                  </p>

                  <p
                    className={`font-bold text-xl ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {service.status}
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 text-sm mb-2">
                    CPU Usage
                  </p>

                  <div className="w-full bg-gray-700 rounded-full h-3">

                    <div
                      className={`h-3 rounded-full ${
                        service.cpu > 80
                          ? "bg-red-500"
                          : service.cpu > 60
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${service.cpu}%` }}
                    ></div>

                  </div>

                  <p className="mt-2 font-semibold">
                    {service.cpu.toFixed(0)}%
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 text-sm mb-2">
                    Memory Usage
                  </p>

                  <div className="w-full bg-gray-700 rounded-full h-3">

                    <div
                      className={`h-3 rounded-full ${
                        service.memory > 80
                          ? "bg-red-500"
                          : service.memory > 60
                          ? "bg-yellow-400"
                          : "bg-cyan-400"
                      }`}
                      style={{ width: `${service.memory}%` }}
                    ></div>

                  </div>

                  <p className="mt-2 font-semibold">
                    {service.memory.toFixed(0)}%
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* INCIDENTS + AI */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          {/* INCIDENT PANEL */}

          <div className="lg:col-span-2 bg-[#0f172a] rounded-3xl p-6 h-fit">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold">
                Active Incidents
              </h2>

              <span className="text-red-400 animate-pulse">
                LIVE
              </span>

            </div>

            <div className="space-y-5 min-h-[120px]">

              {services.filter((s) => s.status !== "HEALTHY").length === 0 ? (

                <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6 text-center">

                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    No Active Incidents
                  </h3>

                  <p className="text-gray-300">
                    All infrastructure services are operating normally.
                  </p>

                </div>

              ) : (

                services
                  .filter((s) => s.status !== "HEALTHY")
                  .map((service, index) => (

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
                        className={`px-4 py-2 rounded-full font-bold ${
                          service.status === "CRITICAL"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {service.status}
                      </span>

                    </div>

                  ))

              )}

            </div>

          </div>

          {/* AI PANEL */}

          <div className="bg-[#0f172a] rounded-3xl p-6">

            <h2 className="text-3xl font-bold mb-6">
              AI Incident Analysis
            </h2>

            <div className="bg-slate-700 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Root Cause Prediction
              </p>

              <h3 className="text-2xl font-bold text-red-400 mb-4">

                {aiAnalysis?.root_cause || "Analyzing..."}

              </h3>

              <p className="text-gray-300 leading-relaxed mb-6">

                {aiAnalysis?.recommendation || "Waiting for AI response..."}

              </p>

              <div className="mb-6">

                <div className="flex justify-between mb-2">

                  <span className="text-gray-400">
                    Confidence
                  </span>

                  <span className="text-white">
                    {aiAnalysis?.confidence || 0}%
                  </span>

                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">

                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{
                      width: `${aiAnalysis?.confidence || 0}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* RESOLUTION STEPS */}

              <div className="mt-6">

                <p className="text-gray-400 mb-3">
                  Resolution Steps
                </p>

                <ul className="space-y-3">

                  {aiAnalysis?.resolution_steps?.map(
                    (step, index) => (

                      <li
                        key={index}
                        className="bg-slate-800 p-3 rounded-xl text-white"
                      >
                        {index + 1}. {step}
                      </li>

                    )
                  )}

                </ul>

              </div>

            </div>

          </div>

        </div>

        {/* SYSTEM STATUS */}

        <div className="bg-[#0f172a] rounded-3xl p-6">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold">
              System Status
            </h2>

            <span className="text-green-400 font-semibold">
              Operational
            </span>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-slate-700 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                Services Running
              </p>

              <h3 className="text-4xl font-bold">
                4
              </h3>

            </div>

            <div className="bg-slate-700 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                Firing Alerts
              </p>

              <h3 className="text-4xl font-bold text-red-400">
                {activeIncidents}
              </h3>

            </div>

            <div className="bg-slate-700 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                AI Severity
              </p>

              <h3 className="text-3xl font-bold text-yellow-400">
                {aiAnalysis?.severity || "LOW"}
              </h3>

            </div>

            <div className="bg-slate-700 rounded-2xl p-6 text-center">

              <p className="text-gray-400 mb-2">
                AI Confidence
              </p>

              <h3 className="text-4xl font-bold text-cyan-400">
                {aiAnalysis?.confidence || 0}%
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;