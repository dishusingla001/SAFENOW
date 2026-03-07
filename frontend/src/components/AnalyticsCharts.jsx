import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock, AlertCircle, CheckCircle } from "lucide-react";

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];

const AnalyticsCharts = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {analytics.totalRequests}
              </p>
              <p className="text-sm text-gray-400">Total Requests</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {analytics.activeRequests}
              </p>
              <p className="text-sm text-gray-400">Active Now</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {analytics.completedToday}
              </p>
              <p className="text-sm text-gray-400">Completed Today</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {analytics.averageResponseTime}
              </p>
              <p className="text-sm text-gray-400">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Types Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Requests by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.requestsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) =>
                  `${type} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.requestsByType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: "#fff" }}
                formatter={(value, entry) => (
                  <span className="text-gray-300">{entry.payload.type}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Request Types Bar Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Request Volume by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.requestsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="type"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Average Response Time by Hour
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
              label={{
                value: "Minutes",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#9ca3af" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: "#fff" }}
              formatter={(value) => (
                <span className="text-gray-300">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="avgTime"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7 }}
              name="Avg Time (min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            Response Rate
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-3xl font-bold text-white">94.5%</p>
            <p className="text-green-400 text-sm font-semibold mb-1">+2.3%</p>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: "94.5%" }}
            />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            User Satisfaction
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-3xl font-bold text-white">4.8/5</p>
            <p className="text-green-400 text-sm font-semibold mb-1">+0.2</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-8 h-8 rounded ${
                  star <= 4.8 ? "bg-yellow-500" : "bg-dark-800"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            System Uptime
          </h3>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-green-400 text-sm font-semibold mb-1">+0.1%</p>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "99.9%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
