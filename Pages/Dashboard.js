import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { JobSeeker } from "@/entities/JobSeeker";
import { Referrer } from "@/entities/Referrer";
import { ReferralRequest } from "@/entities/ReferralRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  UserPlus,
  Users,
  Search,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Briefcase
} from "lucide-react";

import WelcomeSection from "../components/dashboard/WelcomeSection";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RoleSelection from "./RoleSelection"; // Added RoleSelection import

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.user_type === "job_seeker") {
        const requests = await ReferralRequest.filter({ job_seeker_id: userData.id });
        const activeRequests = requests.filter(r => r.status === "pending").length;
        const completedRequests = requests.filter(r => r.status === "completed").length;
        
        setStats({
          totalRequests: requests.length,
          activeRequests,
          completedRequests,
          successRate: requests.length > 0 ? Math.round((completedRequests / requests.length) * 100) : 0
        });
      } else if (userData.user_type === "referrer") {
        const requests = await ReferralRequest.filter({ referrer_id: userData.id });
        const pendingRequests = requests.filter(r => r.status === "pending").length;
        const completedRequests = requests.filter(r => r.status === "completed").length;
        
        setStats({
          totalRequests: requests.length,
          pendingRequests,
          completedRequests,
          successRate: requests.length > 0 ? Math.round((completedRequests / requests.length) * 100) : 0
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Render RoleSelection if user is not loaded or user_type is not defined
  if (!user) {
    return <RoleSelection />;
  }

  if (!user.user_type) {
    return <RoleSelection />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WelcomeSection user={user} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.user_type === "job_seeker" ? (
            <>
              <StatsCards
                title="Всего заявок"
                value={stats.totalRequests || 0}
                icon={Briefcase}
                bgColor="from-blue-500 to-blue-600"
                trend={`${stats.activeRequests || 0} активных`}
              />
              <StatsCards
                title="В обработке"
                value={stats.activeRequests || 0}
                icon={Clock}
                bgColor="from-yellow-500 to-orange-500"
                trend="Ожидают ответа"
              />
              <StatsCards
                title="Завершено"
                value={stats.completedRequests || 0}
                icon={CheckCircle}
                bgColor="from-green-500 to-emerald-500"
                trend="Успешных соединений"
              />
              <StatsCards
                title="Успешность"
                value={`${stats.successRate || 0}%`}
                icon={TrendingUp}
                bgColor="from-purple-500 to-indigo-500"
                trend="Коэффициент успеха"
              />
            </>
          ) : (
            <>
              <StatsCards
                title="Всего запросов"
                value={stats.totalRequests || 0}
                icon={Users}
                bgColor="from-blue-500 to-blue-600"
                trend={`${stats.pendingRequests || 0} новых`}
              />
              <StatsCards
                title="Ожидают ответа"
                value={stats.pendingRequests || 0}
                icon={Clock}
                bgColor="from-yellow-500 to-orange-500"
                trend="Требуют внимания"
              />
              <StatsCards
                title="Помог с трудоустройством"
                value={stats.completedRequests || 0}
                icon={CheckCircle}
                bgColor="from-green-500 to-emerald-500"
                trend="Успешных рефералов"
              />
              <StatsCards
                title="Рейтинг"
                value={`${stats.successRate || 0}%`}
                icon={TrendingUp}
                bgColor="from-purple-500 to-indigo-500"
                trend="Процент успеха"
              />
            </>
          )}
        </div>

        <QuickActions userType={user.user_type} />
      </div>
    </div>
  );
}

