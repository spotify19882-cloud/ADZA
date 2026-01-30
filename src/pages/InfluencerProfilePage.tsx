import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CATEGORY_LABELS } from '@/types/database.types';
import {
  Star,
  Users,
  Instagram,
  Youtube,
  Twitter,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function InfluencerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { profile, businessProfile } = useAuth();
  const { toast } = useToast();
  const [influencer, setInfluencer] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInfluencer();
      fetchReviews();
    }
  }, [id]);

  const fetchInfluencer = async () => {
    try {
      const { data, error } = await supabase
        .from('influencer_profiles')
        .select(`
          *,
          profile:profiles!influencer_profiles_profile_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setInfluencer(data);
    } catch (error) {
      console.error('Error fetching influencer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer_profile:profiles!reviews_reviewer_profile_id_fkey(full_name, avatar_url)
        `)
        .eq('reviewee_profile_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const sendCollaborationRequest = async () => {
    if (!profile || !businessProfile || !influencer) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'برای ارسال درخواست باید به عنوان کسب‌وکار وارد شوید',
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.from('collaboration_requests').insert({
        business_profile_id: businessProfile.id,
        influencer_profile_id: influencer.id,
        message,
        proposed_budget: budget ? parseInt(budget) : null,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'درخواست ارسال شد',
        description: 'درخواست همکاری شما با موفقیت ارسال شد',
      });

      setDialogOpen(false);
      setMessage('');
      setBudget('');
    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'مشکلی در ارسال درخواست پیش آمد',
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('fa-IR');
  };

  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'توافقی';
    if (min === max) return `${min.toLocaleString('fa-IR')} تومان`;
    return `${min.toLocaleString('fa-IR')} - ${max.toLocaleString('fa-IR')} تومان`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">اینفلوئنسر یافت نشد</h2>
          <Link to="/search" className="text-primary hover:underline">
            بازگشت به جستجو
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به جستجو
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                    <AvatarImage src={influencer.profile?.avatar_url || ''} />
                    <AvatarFallback className="gradient-bg text-primary-foreground text-4xl">
                      {influencer.profile?.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">
                          {influencer.profile?.full_name}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {formatNumber(influencer.followers_count)} فالوور
                          </span>
                          {influencer.rating_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              {influencer.rating_avg.toFixed(1)} ({influencer.rating_count} نظر)
                            </span>
                          )}
                        </div>
                      </div>
                      {influencer.is_available && (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          آماده همکاری
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {influencer.categories?.map((cat: string) => (
                        <Badge key={cat} variant="secondary">
                          {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-4 text-muted-foreground">
                      {influencer.bio || 'بدون توضیحات'}
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-3 mt-4">
                      {influencer.instagram_url && (
                        <a
                          href={influencer.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {influencer.youtube_url && (
                        <a
                          href={influencer.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Youtube className="w-5 h-5" />
                        </a>
                      )}
                      {influencer.twitter_url && (
                        <a
                          href={influencer.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {influencer.portfolio_urls?.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>نمونه کارها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {influencer.portfolio_urls.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  نظرات ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.reviewer_profile?.avatar_url} />
                            <AvatarFallback>
                              {review.reviewer_profile?.full_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.reviewer_profile?.full_name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    هنوز نظری ثبت نشده است
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="glass-card sticky top-24">
              <CardHeader>
                <CardTitle>تعرفه تبلیغات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">قیمت همکاری</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(influencer.min_rate, influencer.max_rate)}
                  </p>
                </div>

                {profile?.role === 'business' && businessProfile ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-bg">
                        <Send className="w-4 h-4 ml-2" />
                        ارسال درخواست همکاری
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>ارسال درخواست همکاری</DialogTitle>
                        <DialogDescription>
                          پیشنهاد خود را برای همکاری با {influencer.profile?.full_name} ارسال کنید
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            پیام
                          </label>
                          <Textarea
                            placeholder="توضیحات پیشنهاد همکاری..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            بودجه پیشنهادی (تومان)
                          </label>
                          <Input
                            type="number"
                            placeholder="مثال: 5000000"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={sendCollaborationRequest}
                          disabled={isSending || !message}
                          className="w-full gradient-bg"
                        >
                          {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                          ) : (
                            <Send className="w-4 h-4 ml-2" />
                          )}
                          ارسال درخواست
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : profile ? (
                  <p className="text-center text-sm text-muted-foreground">
                    فقط کسب‌وکارها می‌توانند درخواست همکاری ارسال کنند
                  </p>
                ) : (
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/auth">ورود برای ارسال درخواست</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
