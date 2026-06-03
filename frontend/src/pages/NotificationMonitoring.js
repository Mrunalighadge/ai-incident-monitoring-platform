import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";



function NotificationMonitoring() {

  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);


  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    queue: 0,
    failures: 0,
    status: "HEALTHY"
  });

  const timestamp = new Date().toLocaleTimeString();

setChartData((prev) => [
  ...prev.slice(-14),
  {
    time: timestamp,
    queue,
    failures,
  },
]);

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
        "https://notification-service-c1gx.onrender.com/metrics"
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
        "notification_cpu_usage"
      );

      const memory = parseMetric(
        "notification_memory_usage"
      );

      const queue = parseMetric(
        "email_queue"
      );

      const failures = parseMetric(
        "failed_notifications"
      );

      const status =
        failures > 5
          ? "CRITICAL"
          : queue > 70
          ? "WARNING"
          : "HEALTHY";

      setStats({
        cpu,
        memory,
        queue,
        failures,
        status
      });

      const timestamp =
        new Date().toLocaleTimeString();

    } catch (error) {

      console.error(
        "Notification metrics failed:",
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

              Notification Monitoring

            </h1>

            <p className="text-gray-400 text-lg">

              Queue analytics and delivery monitoring

            </p>

          </div>

          <div className="bg-slate-900 border border-red-500 rounded-2xl px-8 py-5">

            <p className="text-red-400 text-sm uppercase">

              Notification Status

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
              Email Queue
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">

              {stats.queue.toFixed(0)}

            </h2>

          </div>

          <div className="bg-slate-900 rounded-3xl p-6">

            <p className="text-gray-400 mb-2">
              Failed Notifications
            </p>

            <h2 className="text-4xl font-bold text-red-400">

              {stats.failures.toFixed(0)}

            </h2>

          </div>

        </div>

        

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

  {/* NOTIFICATION DASHBOARD */}

  <div className="bg-slate-900 rounded-3xl p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Notification Analytics Dashboard
      </h2>

      <a
        href="https://rubyplatypus1017.grafana.net/d-solo/mrmcbfb/notification-dashboard"
        target="_blank"
        rel="noreferrer"
        className="text-cyan-400 hover:text-cyan-300"
      >
        Open Grafana →
      </a>

    </div>

    <div className="h-[350px] bg-slate-800 rounded-2xl flex flex-col items-center justify-center">

      <div className="text-6xl mb-4">🔔</div>

      <h3 className="text-xl font-semibold mb-3">
        Notification Monitoring Dashboard
      </h3>

      <p className="text-gray-400 text-center px-6 mb-6">
        View notification CPU usage, memory usage,
        alert traffic and delivery analytics in Grafana.
      </p>

      <a
        href="https://rubyplatypus1017.grafana.net/d-solo/mrmcbfb/notification-dashboard"
        target="_blank"
        rel="noreferrer"
        className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl"
      >
        View Dashboard
      </a>

    </div>

  </div>

  <div className="h-[350px] bg-slate-800 rounded-2xl p-4">

  <ResponsiveContainer width="100%" height="100%">

    <LineChart data={chartData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="time" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="queue"
        stroke="#facc15"
        strokeWidth={2}
      />

      <Line
        type="monotone"
        dataKey="failures"
        stroke="#ef4444"
        strokeWidth={2}
      />

    </LineChart>

  </ResponsiveContainer>

</div>
</div>
        {/* INSIGHTS */}

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-3xl font-bold mb-6">

            Notification Incident Insights

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Predicted Issue
              </p>

              <h3 className="text-lg font-semibold">

                Queue backlog causing delayed processing

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Impact Analysis
              </p>

              <h3 className="text-lg font-semibold">

                Delayed email alerts and notification failures

              </h3>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6">

              <p className="text-gray-400 mb-2">
                Recommended Action
              </p>

              <h3 className="text-lg font-semibold">

                Increase worker throughput and restart queue processors

              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
     );
}
export default NotificationMonitoring;