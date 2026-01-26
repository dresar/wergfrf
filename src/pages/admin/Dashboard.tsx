import { motion } from 'framer-motion';
import { Eye, MessageSquare, FolderKanban, Users } from 'lucide-react';

import { StatsCard } from '@/components/admin/StatsCard';
import { VisitorChart } from '@/components/admin/VisitorChart';
import { DeviceChart } from '@/components/admin/DeviceChart';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { SystemStatus } from '@/components/admin/SystemStatus';
import { useState, useEffect } from 'react';
import { profileAPI, projectsAPI, experienceAPI } from '@/services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalMessages: 0,
    totalProjects: 0,
    totalExperiences: 0,
    viewsChange: 0,
    messagesChange: 0,
    projectsChange: 0,
    experiencesChange: 0,
    weeklyVisitors: [],
    monthlyVisitors: [],
    deviceStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile (untuk views)
      const profile = await profileAPI.get();
      
      // Fetch projects
      const projects = await projectsAPI.getAll();
      
      // Fetch experiences
      const experiences = await experienceAPI.getAll();

      // Hitung stats - menggunakan data realtime dari backend
      const totalProjects = projects.length;
      const totalExperiences = experiences.length;
      
      // Data realtime tanpa mock data
      const realtimeStats = {
        totalViews: profile ? 1 : 0, // Hitung berdasarkan jumlah data yang ada
        totalMessages: 0, // Belum ada endpoint messages
        totalProjects,
        totalExperiences,
        viewsChange: 0, // Tidak ada perubahan untuk data baru
        messagesChange: 0,
        projectsChange: 0,
        experiencesChange: 0,
        weeklyVisitors: [], // Kosongkan data dummy
        monthlyVisitors: [], // Kosongkan data dummy
        deviceStats: [] // Kosongkan data dummy
      };

      setStats(realtimeStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Memuat data dasbor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Dasbor</h1>
          <p className="text-muted-foreground mt-1">Ringkasan performa portofolio Anda</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Kunjungan"
            value={stats.totalViews}
            change={stats.viewsChange}
            icon={<Eye className="h-6 w-6" />}
            delay={0}
          />
          <StatsCard
            title="Pesan"
            value={stats.totalMessages}
            change={stats.messagesChange}
            icon={<MessageSquare className="h-6 w-6" />}
            delay={0.1}
          />
          <StatsCard
            title="Proyek"
            value={stats.totalProjects}
            change={stats.projectsChange}
            icon={<FolderKanban className="h-6 w-6" />}
            delay={0.2}
          />
          <StatsCard
            title="Pengalaman"
            value={stats.totalExperiences}
            change={stats.experiencesChange}
            icon={<Users className="h-6 w-6" />}
            delay={0.3}
          />
        </div>

        {/* Charts & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VisitorChart 
              weeklyData={stats.weeklyVisitors} 
              monthlyData={stats.monthlyVisitors}
              title="Lalu Lintas Pengunjung" 
            />
          </div>
          <div className="space-y-6">
            <SystemStatus />
            <DeviceChart data={stats.deviceStats} title="Rincian Perangkat" />
          </div>
        </div>

        {/* Activity Feed */}
      <ActivityFeed activities={[]} title="Aktivitas Terbaru" />
    </div>
  );
};

export default Dashboard;