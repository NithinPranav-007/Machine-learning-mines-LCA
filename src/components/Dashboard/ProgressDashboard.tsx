import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Flame, Target, TrendingUp, Award, Star, Zap, Leaf } from 'lucide-react';
import { Card, CardHeader, CardBody, Badge, LoadingSkeleton } from '../ui';

/**
 * Progress Dashboard Component
 * Displays user achievements, statistics, and gamification data
 */
export const ProgressDashboard: React.FC = () => {
  const { analysisResults } = useStore();
  const {
    unlockedBadges,
    totalPoints,
    currentStreak,
    longestStreak,
    totalAnalyses,
    totalCircularAnalyses,
    averageCircularityScore,
    totalCarbonReduced,
    badges,
  } = useGamificationStore();

  // Generate mock history data
  const historyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        analyses: Math.floor(Math.random() * 4),
        circularity: Math.random() * 0.3 + 0.5,
      };
    });
  }, []);

  // Calculate material breakdown
  const materialBreakdown = useMemo(() => {
    const breakdown = analysisResults.reduce(
      (acc, result) => {
        const material = result.parameters.materialId;
        const existing = acc.find((m) => m.name === material);
        if (existing) {
          existing.value++;
        } else {
          acc.push({ name: material, value: 1 });
        }
        return acc;
      },
      [] as { name: string; value: number }[]
    );
    return breakdown;
  }, [analysisResults]);

  const COLORS = ['#0ea5e9', '#14b8a6', '#eab308', '#f59e0b', '#ef4444'];

  if (analysisResults.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Dashboard Coming Soon
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          Complete your first analysis to see your progress dashboard, achievements,
          and performance insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 opacity-60"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-teal-100 px-6 py-3 rounded-full mb-6">
          <Trophy className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-blue-700">Your Achievement Dashboard</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {totalPoints} Points Earned
        </h1>
        <p className="text-slate-600">
          {unlockedBadges.length} badges unlocked • {currentStreak} day streak •{' '}
          {totalAnalyses} analyses completed
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Total Analyses */}
        <Card elevation="lg">
          <CardBody className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalAnalyses}</p>
            <p className="text-slate-600 text-sm mt-1">Total Analyses</p>
          </CardBody>
        </Card>

        {/* Current Streak */}
        <Card elevation="lg">
          <CardBody className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{currentStreak}</p>
            <p className="text-slate-600 text-sm mt-1">Day Streak</p>
          </CardBody>
        </Card>

        {/* Avg Circularity */}
        <Card elevation="lg">
          <CardBody className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {(averageCircularityScore * 100).toFixed(0)}%
            </p>
            <p className="text-slate-600 text-sm mt-1">Avg Circularity</p>
          </CardBody>
        </Card>

        {/* Carbon Reduced */}
        <Card elevation="lg">
          <CardBody className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {totalCarbonReduced.toFixed(0)}
            </p>
            <p className="text-slate-600 text-sm mt-1">kg CO₂ Reduced</p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Analysis Trend */}
        <Card elevation="lg">
          <CardHeader>
            <h2 className="text-lg font-bold text-slate-900">Weekly Activity</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="analyses"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Material Distribution */}
        {materialBreakdown.length > 0 && (
          <Card elevation="lg">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">Materials Analyzed</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={materialBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {materialBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Badges Section */}
      <Card elevation="lg" className="relative z-10">
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements & Badges
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {badges.map((badge) => {
              const isUnlocked = unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`text-center p-4 rounded-lg transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-300'
                      : 'bg-slate-100 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-sm text-slate-900">{badge.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{badge.requirement}</p>
                  {isUnlocked && (
                    <div className="mt-2 text-xs font-bold text-amber-600">
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Leaderboard Placeholder */}
      <Card elevation="lg" className="relative z-10">
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Local Statistics
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-700 font-semibold">Longest Streak</p>
              <p className="text-2xl font-bold text-blue-900">{longestStreak} days</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-700 font-semibold">Circular Analyses</p>
              <p className="text-2xl font-bold text-green-900">{totalCircularAnalyses}</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-sm text-purple-700 font-semibold">Total Points</p>
              <p className="text-2xl font-bold text-purple-900">{totalPoints}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
