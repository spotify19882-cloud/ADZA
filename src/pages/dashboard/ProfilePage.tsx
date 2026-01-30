import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Category, CATEGORY_LABELS } from '@/types/database.types';
import { Loader2, Save, User, Building2 } from 'lucide-react';

const ALL_CATEGORIES: Category[] = [
  'food', 'fashion', 'tech', 'beauty', 'fitness', 'travel',
  'lifestyle', 'entertainment', 'education', 'gaming', 'sports',
  'music', 'art', 'photography', 'other'
];

export default function ProfilePage() {
  const { profile, influencerProfile, businessProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Influencer fields
  const [bio, setBio] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [followersCount, setFollowersCount] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Business fields
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
    if (influencerProfile) {
      setBio(influencerProfile.bio || '');
      setCategories(influencerProfile.categories || []);
      setFollowersCount(influencerProfile.followers_count?.toString() || '');
      setInstagramUrl(influencerProfile.instagram_url || '');
      setYoutubeUrl(influencerProfile.youtube_url || '');
      setTiktokUrl(influencerProfile.tiktok_url || '');
      setTwitterUrl(influencerProfile.twitter_url || '');
      setMinRate(influencerProfile.min_rate?.toString() || '');
      setMaxRate(influencerProfile.max_rate?.toString() || '');
      setIsAvailable(influencerProfile.is_available ?? true);
    }
    if (businessProfile) {
      setCompanyName(businessProfile.company_name || '');
      setCompanyDescription(businessProfile.company_description || '');
      setIndustry(businessProfile.industry || '');
      setWebsiteUrl(businessProfile.website_url || '');
    }
  }, [profile, influencerProfile, businessProfile]);

  const toggleCategory = (cat: Category) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Update role-specific profile
      if (profile.role === 'influencer' && influencerProfile) {
        const { error: infError } = await supabase
          .from('influencer_profiles')
          .update({
            bio,
            categories,
            followers_count: parseInt(followersCount) || 0,
            instagram_url: instagramUrl || null,
            youtube_url: youtubeUrl || null,
            tiktok_url: tiktokUrl || null,
            twitter_url: twitterUrl || null,
            min_rate: parseInt(minRate) || 0,
            max_rate: parseInt(maxRate) || 0,
            is_available: isAvailable,
          })
          .eq('id', influencerProfile.id);

        if (infError) throw infError;
      } else if (profile.role === 'business' && businessProfile) {
        const { error: bizError } = await supabase
          .from('business_profiles')
          .update({
            company_name: companyName,
            company_description: companyDescription || null,
            industry: industry || null,
            website_url: websiteUrl || null,
          })
          .eq('id', businessProfile.id);

        if (bizError) throw bizError;
      }

      await refreshProfile();
      toast({
        title: 'ذخیره شد',
        description: 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'مشکلی در ذخیره اطلاعات پیش آمد',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">پروفایل</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات حساب کاربری</p>
      </div>

      {/* Basic Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            اطلاعات پایه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>نام کامل</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="نام و نام خانوادگی"
              />
            </div>
            <div>
              <Label>تلفن</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxxx"
              />
            </div>
          </div>
          <div>
            <Label>ایمیل</Label>
            <Input value={profile?.email || ''} disabled />
            <p className="text-xs text-muted-foreground mt-1">ایمیل قابل تغییر نیست</p>
          </div>
        </CardContent>
      </Card>

      {/* Influencer Profile */}
      {profile?.role === 'influencer' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>اطلاعات اینفلوئنسری</CardTitle>
            <CardDescription>
              اطلاعاتی که به کسب‌وکارها نمایش داده می‌شود
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>بیوگرافی</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="درباره خودتان و حوزه فعالیتتان بنویسید..."
                rows={4}
              />
            </div>

            <div>
              <Label className="mb-3 block">دسته‌بندی‌ها</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <Badge
                    key={cat}
                    variant={categories.includes(cat) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleCategory(cat)}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>تعداد فالوور</Label>
                <Input
                  type="number"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                  placeholder="مثال: 50000"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <Label>آماده همکاری هستم</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>حداقل تعرفه (تومان)</Label>
                <Input
                  type="number"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  placeholder="مثال: 500000"
                />
              </div>
              <div>
                <Label>حداکثر تعرفه (تومان)</Label>
                <Input
                  type="number"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  placeholder="مثال: 5000000"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>لینک شبکه‌های اجتماعی</Label>
              <Input
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="لینک اینستاگرام"
              />
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="لینک یوتیوب"
              />
              <Input
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="لینک تیک‌تاک"
              />
              <Input
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="لینک توییتر"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Profile */}
      {profile?.role === 'business' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              اطلاعات کسب‌وکار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>نام شرکت/برند</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="نام کسب‌وکار"
              />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="درباره کسب‌وکار خود بنویسید..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>صنعت/حوزه فعالیت</Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="مثال: پوشاک"
                />
              </div>
              <div>
                <Label>وبسایت</Label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave} disabled={isLoading} className="gradient-bg">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin ml-2" />
        ) : (
          <Save className="w-4 h-4 ml-2" />
        )}
        ذخیره تغییرات
      </Button>
    </div>
  );
}
