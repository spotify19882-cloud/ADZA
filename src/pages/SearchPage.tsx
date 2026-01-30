import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { InfluencerCard } from '@/components/cards/InfluencerCard';
import { supabase } from '@/integrations/supabase/client';
import { Category, CATEGORY_LABELS } from '@/types/database.types';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';

const ALL_CATEGORIES: Category[] = [
  'food', 'fashion', 'tech', 'beauty', 'fitness', 'travel', 
  'lifestyle', 'entertainment', 'education', 'gaming', 'sports', 
  'music', 'art', 'photography', 'other'
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    (searchParams.get('category')?.split(',') as Category[]) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [followersRange, setFollowersRange] = useState<[number, number]>([0, 10000000]);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  useEffect(() => {
    fetchInfluencers();
  }, [selectedCategories, onlyAvailable]);

  const fetchInfluencers = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('influencer_profiles')
        .select(`
          *,
          profile:profiles!influencer_profiles_profile_id_fkey(full_name, avatar_url, email)
        `)
        .gte('min_rate', priceRange[0])
        .lte('max_rate', priceRange[1])
        .gte('followers_count', followersRange[0])
        .lte('followers_count', followersRange[1]);

      if (onlyAvailable) {
        query = query.eq('is_available', true);
      }

      if (selectedCategories.length > 0) {
        query = query.overlaps('categories', selectedCategories);
      }

      const { data, error } = await query.order('rating_avg', { ascending: false });

      if (error) throw error;

      let results = data || [];
      
      // Client-side search by name
      if (searchQuery) {
        results = results.filter((inf) =>
          inf.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inf.bio?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setInfluencers(results);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchInfluencers();
  };

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50000000]);
    setFollowersRange([0, 10000000]);
    setOnlyAvailable(true);
    setSearchQuery('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString('fa-IR');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-3 block">دسته‌بندی</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategories.includes(cat) ? 'default' : 'outline'}
              className="cursor-pointer transition-colors"
              onClick={() => toggleCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">محدوده قیمت (تومان)</Label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={50000000}
          step={100000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0].toLocaleString('fa-IR')}</span>
          <span>{priceRange[1].toLocaleString('fa-IR')}</span>
        </div>
      </div>

      {/* Followers Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">تعداد فالوور</Label>
        <Slider
          value={followersRange}
          onValueChange={(value) => setFollowersRange(value as [number, number])}
          max={10000000}
          step={10000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatNumber(followersRange[0])}</span>
          <span>{formatNumber(followersRange[1])}</span>
        </div>
      </div>

      {/* Only Available */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="only-available"
          checked={onlyAvailable}
          onCheckedChange={(checked) => setOnlyAvailable(checked as boolean)}
        />
        <Label htmlFor="only-available" className="cursor-pointer">
          فقط اینفلوئنسرهای آماده همکاری
        </Label>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1 gradient-bg">
          اعمال فیلتر
        </Button>
        <Button onClick={clearFilters} variant="outline">
          پاک کردن
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">جستجوی اینفلوئنسرها</h1>
          <p className="text-muted-foreground">
            بهترین اینفلوئنسرها را برای کمپین خود پیدا کنید
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="جستجو بر اساس نام یا توضیحات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-10"
            />
          </div>
          <Button onClick={handleSearch} className="gradient-bg">
            جستجو
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>فیلترها</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="gap-1">
                {CATEGORY_LABELS[cat]}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              پاک کردن همه
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">فیلترها</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : influencers.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-4">
                  {influencers.length} اینفلوئنسر یافت شد
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {influencers.map((influencer) => (
                    <InfluencerCard key={influencer.id} influencer={influencer} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">نتیجه‌ای یافت نشد</h3>
                <p className="text-muted-foreground">
                  فیلترهای جستجو را تغییر دهید یا عبارت دیگری جستجو کنید
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
