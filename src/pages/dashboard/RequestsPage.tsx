import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STATUS_LABELS, RequestStatus } from '@/types/database.types';
import { Loader2, Check, X, FileText, Clock } from 'lucide-react';

export default function RequestsPage() {
  const { profile, influencerProfile, businessProfile } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<RequestStatus | 'all'>('all');

  useEffect(() => {
    if (profile) {
      fetchRequests();
    }
  }, [profile, activeTab]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('collaboration_requests')
        .select(`
          *,
          campaign:campaigns(*),
          business_profile:business_profiles!collaboration_requests_business_profile_id_fkey(
            company_name,
            logo_url,
            profile:profiles!business_profiles_profile_id_fkey(full_name, avatar_url)
          ),
          influencer_profile:influencer_profiles!collaboration_requests_influencer_profile_id_fkey(
            profile:profiles!influencer_profiles_profile_id_fkey(full_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (profile?.role === 'business' && businessProfile) {
        query = query.eq('business_profile_id', businessProfile.id);
      } else if (influencerProfile) {
        query = query.eq('influencer_profile_id', influencerProfile.id);
      }

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      const { data, error } = await query;
      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus) => {
    try {
      const { error } = await supabase
        .from('collaboration_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'به‌روزرسانی شد',
        description: `وضعیت درخواست به "${STATUS_LABELS[status]}" تغییر کرد`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'مشکلی در به‌روزرسانی پیش آمد',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          درخواست‌های همکاری
        </h1>
        <p className="text-muted-foreground">
          مدیریت درخواست‌های دریافتی و ارسالی
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="pending">در انتظار</TabsTrigger>
          <TabsTrigger value="accepted">پذیرفته شده</TabsTrigger>
          <TabsTrigger value="rejected">رد شده</TabsTrigger>
          <TabsTrigger value="completed">تکمیل شده</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                    <AvatarImage
                      src={
                        profile?.role === 'business'
                          ? request.influencer_profile?.profile?.avatar_url
                          : request.business_profile?.logo_url || request.business_profile?.profile?.avatar_url
                      }
                    />
                    <AvatarFallback className="gradient-bg text-primary-foreground text-xl">
                      {profile?.role === 'business'
                        ? request.influencer_profile?.profile?.full_name?.charAt(0)
                        : request.business_profile?.company_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile?.role === 'business'
                            ? request.influencer_profile?.profile?.full_name
                            : request.business_profile?.company_name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(request.created_at).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {STATUS_LABELS[request.status as keyof typeof STATUS_LABELS]}
                      </Badge>
                    </div>

                    {request.message && (
                      <p className="mt-3 text-muted-foreground">{request.message}</p>
                    )}

                    {request.proposed_budget && (
                      <p className="mt-2 text-sm">
                        <span className="text-muted-foreground">بودجه پیشنهادی: </span>
                        <span className="font-medium text-primary">
                          {request.proposed_budget.toLocaleString('fa-IR')} تومان
                        </span>
                      </p>
                    )}

                    {/* Actions for Influencers */}
                    {profile?.role === 'influencer' && request.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateRequestStatus(request.id, 'accepted')}
                        >
                          <Check className="w-4 h-4 ml-1" />
                          پذیرفتن
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                        >
                          <X className="w-4 h-4 ml-1" />
                          رد کردن
                        </Button>
                      </div>
                    )}

                    {/* Mark as complete */}
                    {request.status === 'accepted' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'completed')}
                        >
                          <Check className="w-4 h-4 ml-1" />
                          تکمیل همکاری
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">درخواستی وجود ندارد</h3>
            <p className="text-muted-foreground">
              {activeTab === 'all'
                ? 'هنوز درخواست همکاری وجود ندارد'
                : `درخواستی با وضعیت "${STATUS_LABELS[activeTab as RequestStatus]}" یافت نشد`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
