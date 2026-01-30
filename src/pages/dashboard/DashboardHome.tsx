import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS } from '@/types/database.types';
import {
  FileText,
  MessageSquare,
  Bell,
  TrendingUp,
  Sparkles,
  Users,
  Star,
  ArrowLeft,
} from 'lucide-react';

export default function DashboardHome() {
  const { profile, influencerProfile, businessProfile } = useAuth();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    unreadMessages: 0,
    unreadNotifications: 0,
    totalCampaigns: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      fetchStats();
      fetchRecentRequests();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      // Pending requests
      let requestsQuery = supabase
        .from('collaboration_requests')
        .select('id', { count: 'exact' })
        .eq('status', 'pending');

      if (profile?.role === 'business' && businessProfile) {
        requestsQuery = requestsQuery.eq('business_profile_id', businessProfile.id);
      } else if (influencerProfile) {
        requestsQuery = requestsQuery.eq('influencer_profile_id', influencerProfile.id);
      }

      const { count: pendingCount } = await requestsQuery;

      // Unread messages
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('recipient_profile_id', profile?.id)
        .eq('is_read', false);

      // Unread notifications
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('profile_id', profile?.id)
        .eq('is_read', false);

      // Total campaigns (for business)
      let campaignsCount = 0;
      if (businessProfile) {
        const { count } = await supabase
          .from('campaigns')
          .select('id', { count: 'exact' })
          .eq('business_profile_id', businessProfile.id);
        campaignsCount = count || 0;
      }

      setStats({
        pendingRequests: pendingCount || 0,
        unreadMessages: messagesCount || 0,
        unreadNotifications: notifCount || 0,
        totalCampaigns: campaignsCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentRequests = async () => {
    try {
      let query = supabase
        .from('collaboration_requests')
        .select(`
          *,
          business_profile:business_profiles!collaboration_requests_business_profile_id_fkey(
            company_name,
            profile:profiles!business_profiles_profile_id_fkey(full_name)
          ),
          influencer_profile:influencer_profiles!collaboration_requests_influencer_profile_id_fkey(
            profile:profiles!influencer_profiles_profile_id_fkey(full_name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (profile?.role === 'business' && businessProfile) {
        query = query.eq('business_profile_id', businessProfile.id);
      } else if (influencerProfile) {
        query = query.eq('influencer_profile_id', influencerProfile.id);
      }

      const { data } = await query;
      setRecentRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'accepted': return 'bg-green-500/20 text-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      case 'completed': return 'bg-blue-500/20 text-blue-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          سلام، {profile?.full_name}! 👋
        </h1>
        <p className="text-muted-foreground">
          به داشبورد خود خوش آمدید
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">درخواست‌های در انتظار</p>
                <p className="text-3xl font-bold mt-1">{stats.pendingRequests}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">پیام‌های خوانده نشده</p>
                <p className="text-3xl font-bold mt-1">{stats.unreadMessages}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">اعلان‌های جدید</p>
                <p className="text-3xl font-bold mt-1">{stats.unreadNotifications}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {profile?.role === 'business' ? (
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">کمپین‌های فعال</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalCampaigns}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">امتیاز</p>
                  <p className="text-3xl font-bold mt-1 flex items-center gap-1">
                    {influencerProfile?.rating_avg?.toFixed(1) || '0'}
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">آخرین درخواست‌ها</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/requests">
                مشاهده همه
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        {profile?.role === 'business'
                          ? req.influencer_profile?.profile?.full_name
                          : req.business_profile?.company_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(req.status)}>
                      {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                هنوز درخواستی وجود ندارد
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.role === 'business' ? (
              <>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/search">
                    <Users className="w-5 h-5 ml-2" />
                    جستجوی اینفلوئنسرها
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/dashboard/campaigns">
                    <Sparkles className="w-5 h-5 ml-2" />
                    مدیریت کمپین‌ها
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/dashboard/profile">
                    <Star className="w-5 h-5 ml-2" />
                    تکمیل پروفایل
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/campaigns">
                    <Sparkles className="w-5 h-5 ml-2" />
                    مشاهده کمپین‌ها
                  </Link>
                </Button>
              </>
            )}
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/dashboard/messages">
                <MessageSquare className="w-5 h-5 ml-2" />
                پیام‌ها
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
