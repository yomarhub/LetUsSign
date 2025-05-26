'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type AttendanceStats = {
  totalUsers: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number; // ex: 0.87
};

export default function AttendanceStatsPage() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/attendance-stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du fetch des stats de présence', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Statistiques de présence</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Utilisateurs totaux</p>
              <p className="text-xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Présents aujourd’hui</p>
              <p className="text-xl font-bold">{stats.presentToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Absents aujourd’hui</p>
              <p className="text-xl font-bold">{stats.absentToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-500 text-sm">Taux de présence</p>
              <p className="text-xl font-bold">
                {(stats.attendanceRate * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-red-500">Impossible de charger les statistiques.</p>
      )}
    </div>
  );
}
