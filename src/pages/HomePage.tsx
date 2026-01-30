import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfluencerCard } from '@/components/cards/InfluencerCard';
import { CampaignCard } from '@/components/cards/CampaignCard';
import { supabase } from '@/integrations/supabase/client';
import { InfluencerProfile, Campaign, CATEGORY_LABELS, Category } from '@/types/database.types';
import {
  Search,
  TrendingUp,
  Users,
  Sparkles,
  ArrowLeft,
  Star,
  Shield,
  Zap,
  Target,
  MessageSquare,
} from 'lucide-react';

export default function HomePage() {
  const [topInfluencers, setTopInfluencers] = useState<any[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch top influencers
      const { data: influencers } = await supabase
        .from('influencer_profiles')
        .select(`
          *,
          profile:profiles!influencer_profiles_profile_id_fkey(full_name, avatar_url)
        `)
        .eq('is_available', true)
        .order('rating_avg', { ascending: false })
        .limit(6);

      // Fetch top campaigns
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select(`
          *,
          business_profile:business_profiles!campaigns_business_profile_id_fkey(
            company_name, 
            logo_url,
            profile:profiles!business_profiles_profile_id_fkey(full_name)
          )
        `)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      setTopInfluencers(influencers || []);
      setTopCampaigns(campaigns || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: 'هدفمند',
      description: 'پیدا کردن اینفلوئنسر مناسب با فیلترهای پیشرفته',
    },
    {
      icon: Shield,
      title: 'امن و مطمئن',
      description: 'پرداخت امن و تضمین کیفیت همکاری',
    },
    {
      icon: Zap,
      title: 'سریع',
      description: 'ارتباط مستقیم و بی‌واسطه با اینفلوئنسرها',
    },
    {
      icon: MessageSquare,
      title: 'پیام‌رسان آنی',
      description: 'چت آنی و مذاکره آسان در پلتفرم',
    },
  ];

  const categories: Category[] = ['fashion', 'food', 'tech', 'beauty', 'fitness', 'travel', 'lifestyle', 'entertainment'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 gradient-bg text-primary-foreground px-4 py-1.5">
              <Sparkles className="w-4 h-4 ml-1" />
              پلتفرم شماره یک همکاری اینفلوئنسرها
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">اینفلوئنسر</span> مناسب 
              <br />
              کسب‌وکار خود را پیدا کنید
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              با هزاران اینفلوئنسر معتبر در حوزه‌های مختلف آشنا شوید و 
              همکاری‌های موثر تبلیغاتی را تجربه کنید
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-bg text-lg px-8" asChild>
                <Link to="/search">
                  <Search className="w-5 h-5 ml-2" />
                  جستجوی اینفلوئنسرها
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/auth?tab=signup">
                  ثبت‌نام رایگان
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">۵۰۰+</div>
                <div className="text-sm text-muted-foreground mt-1">اینفلوئنسر فعال</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">۱۰۰+</div>
                <div className="text-sm text-muted-foreground mt-1">کمپین موفق</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">۲۵۰+</div>
                <div className="text-sm text-muted-foreground mt-1">کسب‌وکار</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">دسته‌بندی‌ها</h2>
            <p className="text-muted-foreground">اینفلوئنسرها را بر اساس حوزه تخصصی پیدا کنید</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link key={cat} to={`/search?category=${cat}`}>
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {CATEGORY_LABELS[cat]}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Influencers Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" />
                برترین اینفلوئنسرها
              </h2>
              <p className="text-muted-foreground">محبوب‌ترین و پرامتیازترین اینفلوئنسرها</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/search">
                مشاهده همه
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : topInfluencers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topInfluencers.map((influencer) => (
                <InfluencerCard key={influencer.id} influencer={influencer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              هنوز اینفلوئنسری ثبت‌نام نکرده است
            </div>
          )}
        </div>
      </section>

      {/* Top Campaigns Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                کمپین‌های فعال
              </h2>
              <p className="text-muted-foreground">آخرین فرصت‌های همکاری</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/campaigns">
                مشاهده همه
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : topCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              هنوز کمپینی ایجاد نشده است
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">چرا اینفلوئنسر مارکت؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما بهترین تجربه همکاری بین کسب‌وکارها و اینفلوئنسرها را فراهم می‌کنیم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="relative">
              <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                همین الان شروع کنید
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                ثبت‌نام رایگان و شروع همکاری با بهترین اینفلوئنسرها و کسب‌وکارها
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-bg" asChild>
                  <Link to="/auth?tab=signup&role=business">
                    ثبت‌نام صاحبان کسب‌وکار
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth?tab=signup&role=influencer">
                    ثبت‌نام اینفلوئنسرها
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
