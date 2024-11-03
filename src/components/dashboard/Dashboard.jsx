// src/components/Dashboard.jsx
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/auth';
import { fetchAkilimoData } from '../../services/api';
import { MapPin, Users, Activity, Calendar, LogOut, Download } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

// Components
const StatsCard = ({ title, value, icon: Icon, description }) => (
  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {Icon && <Icon className="h-5 w-5 text-gray-400" />}
    </div>
    <div className="mt-2">
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="h-[300px]">
      {children}
    </div>
  </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { credentials, logout } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['akilimoData'],
    queryFn: () => fetchAkilimoData(credentials),
    enabled: !!credentials?.username && !!credentials?.password,
  });

  const stats = useMemo(() => {
    if (!data?.content) return null;

    const result = {
      totalRequests: data.content.length,
      countryStats: {},
      useCaseStats: {},
      userTypeStats: {},
      genderStats: {},
      timelineStats: {},
    };

    data.content.forEach(record => {
      // Country stats
      result.countryStats[record.countryCode] = (result.countryStats[record.countryCode] || 0) + 1;
      
      // Use case stats
      result.useCaseStats[record.useCase] = (result.useCaseStats[record.useCase] || 0) + 1;
      
      // User type stats
      result.userTypeStats[record.userType] = (result.userTypeStats[record.userType] || 0) + 1;
      
      // Gender stats
      result.genderStats[record.gender] = (result.genderStats[record.gender] || 0) + 1;
      
      // Timeline stats (by month)
      const date = new Date(record.requestDate);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      result.timelineStats[monthYear] = (result.timelineStats[monthYear] || 0) + 1;
    });

    return result;
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p className="font-bold">Error loading data:</p>
          <p>{error.message}</p>
          <button 
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare chart data
  const countryData = Object.entries(stats.countryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const useCaseData = Object.entries(stats.useCaseStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const userTypeData = Object.entries(stats.userTypeStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const genderData = Object.entries(stats.genderStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const timelineData = Object.entries(stats.timelineStats)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AKILIMO Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analyzing {stats.totalRequests.toLocaleString()} farmer requests
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Requests"
            value={stats.totalRequests.toLocaleString()}
            icon={Activity}
            description="Total farmer interactions"
          />
          <StatsCard
            title="Countries"
            value={Object.keys(stats.countryStats).length}
            icon={MapPin}
            description={`Active in ${Object.keys(stats.countryStats).join(', ')}`}
          />
          <StatsCard
            title="User Types"
            value={Object.keys(stats.userTypeStats).length}
            icon={Users}
            description="Different user categories"
          />
          <StatsCard
            title="Use Cases"
            value={Object.keys(stats.useCaseStats).length}
            icon={Calendar}
            description="Types of requests"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <ChartCard title="Request Timeline">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Country Distribution */}
          <ChartCard title="Requests by Country">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Use Case Distribution */}
          <ChartCard title="Use Case Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={useCaseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {useCaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* User Types Distribution */}
          <ChartCard title="User Types Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gender Distribution */}
          <ChartCard title="Gender Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Detailed Statistics */}
          <ChartCard title="Summary Statistics">
            <div className="h-full overflow-auto p-4">
              <div className="space-y-6">
                {/* Countries */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Geographic Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.countryStats).map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{country}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {count.toLocaleString()} ({((count / stats.totalRequests) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Use Cases</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.useCaseStats).map(([useCase, count]) => (
                      <div key={useCase} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{useCase}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {count.toLocaleString()} ({((count / stats.totalRequests) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Types */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">User Types</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.userTypeStats).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{type.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {count.toLocaleString()} ({((count / stats.totalRequests) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;