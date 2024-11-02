// src/components/Dashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/auth';
import { fetchAkilimoData } from '../../services/api';
//import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Users, Activity, Calendar } from 'lucide-react';
import StatsCard from '../dashboard/StatsCard';
import UseCaseChart from '../dashboard/UseCaseChart';
import CountryChart from '../dashboard/CountryChart';
import UserTypeChart from '../dashboard/UserTypeChart';
import TimelineChart from '../dashboard/TimelineChart';

const Dashboard = () => {
  const credentials = useAuthStore((state) => state.credentials);
  const { data, isLoading, error } = useQuery({
    queryKey: ['akilimoData'],
    queryFn: () => fetchAkilimoData(credentials),
  });

  const processData = (rawData) => {
    if (!rawData?.content) return null;
    
    const content = rawData.content;
    
    const stats = {
      requestsByDate: {},
      countryStats: {},
      useCaseStats: {},
      userTypeStats: {},
      totalRequests: rawData.totalElements || 0,
      totalPages: rawData.totalPages || 0
    };
    
    content.forEach(entry => {
      const date = entry.requestDate.split('T')[0];
      stats.requestsByDate[date] = (stats.requestsByDate[date] || 0) + 1;
      stats.countryStats[entry.countryCode] = (stats.countryStats[entry.countryCode] || 0) + 1;
      stats.useCaseStats[entry.useCase] = (stats.useCaseStats[entry.useCase] || 0) + 1;
      stats.userTypeStats[entry.userType] = (stats.userTypeStats[entry.userType] || 0) + 1;
    });

    return stats;
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;

  const stats = processData(data);
  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AKILIMO Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time analytics from farmer requests and interactions
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          value={stats.totalRequests.toLocaleString()}
          icon={Activity}
          description="Total number of farmer requests"
        />
        <StatsCard
          title="Countries"
          value={Object.keys(stats.countryStats).length}
          icon={MapPin}
          description="Active countries"
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
          description="Total use case types"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <CountryChart data={stats.countryStats} />
        <UseCaseChart data={stats.useCaseStats} />
        <UserTypeChart data={stats.userTypeStats} />
        <TimelineChart data={stats.requestsByDate} />
      </div>
    </div>
  );
};

export default Dashboard;