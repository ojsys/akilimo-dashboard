// src/components/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/auth';
import { fetchAkilimoData } from '../../services/api';
import { MapPin, Users, Activity, Calendar, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Loading Progress Component
const LoadingProgress = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Complete Dataset</h3>
          <p className="text-gray-500 text-center mb-4">
            Please wait while we fetch all records. This may take a few moments...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="animate-pulse bg-blue-500 h-2 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const credentials = useAuthStore((state) => state.credentials);
  const logout = useAuthStore((state) => state.logout);

  const { data, isLoading, error } = useQuery({
    queryKey: ['akilimoData'],
    queryFn: () => fetchAkilimoData(credentials),
    enabled: Boolean(credentials?.username && credentials?.password),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  const processData = (rawData) => {
    if (!rawData?.content) return null;
    
    const stats = {
      requestsByDate: {},
      countryStats: {},
      useCaseStats: {},
      userTypeStats: {},
      totalRequests: rawData.content.length,
      totalPages: rawData.totalPages
    };
    
    rawData.content.forEach(entry => {
      // Process dates
      const date = entry.requestDate.split('T')[0];
      stats.requestsByDate[date] = (stats.requestsByDate[date] || 0) + 1;
      
      // Process countries
      stats.countryStats[entry.countryCode] = (stats.countryStats[entry.countryCode] || 0) + 1;
      
      // Process use cases
      stats.useCaseStats[entry.useCase] = (stats.useCaseStats[entry.useCase] || 0) + 1;
      
      // Process user types
      stats.userTypeStats[entry.userType] = (stats.userTypeStats[entry.userType] || 0) + 1;
    });

    return stats;
  };

  if (isLoading) {
    return <LoadingProgress />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p className="font-bold">Error loading data:</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const stats = processData(data);
  if (!stats) return null;

  // Prepare chart data
  const countryData = Object.entries(stats.countryStats).map(([name, value]) => ({ name, value }));
  const useCaseData = Object.entries(stats.useCaseStats).map(([name, value]) => ({ name, value }));
  const userTypeData = Object.entries(stats.userTypeStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AKILIMO Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analyzing {stats.totalRequests.toLocaleString()} total farmer requests
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
            description="Various user categories"
          />
          <StatsCard
            title="Use Cases"
            value={Object.keys(stats.useCaseStats).length}
            icon={Calendar}
            description="Different types of requests"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <ChartCard title="Summary Statistics">
            <div className="h-full overflow-auto p-4">
              <div className="grid grid-cols-2 gap-8">
                {/* Use Cases Summary Table */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Use Cases Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.useCaseStats).map(([useCase, count]) => (
                      <div key={useCase} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                          <span className="text-sm text-gray-600">{useCase}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Types Summary Table */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">User Types Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.userTypeStats).map(([userType, count]) => (
                      <div key={userType} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            {userType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="mt-8 border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-4">Geographic Distribution</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats.countryStats).map(([country, count]) => (
                    <div key={country} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">{country}</div>
                      <div className="text-lg font-medium text-gray-900">
                        {count.toLocaleString()} requests
                      </div>
                      <div className="text-xs text-gray-500">
                        {((count / stats.totalRequests) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  ))}
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