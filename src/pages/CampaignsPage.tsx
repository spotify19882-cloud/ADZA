import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CampaignCard } from '@/components/cards/CampaignCard';
import { Badge } from '@/components/ui/badge';
import { Category, CATEGORY_LABELS } from '@/types/database.types';
import { Loader2, Sparkles } from 'lucide-react';

const ALL_CATEGORIES: Category[] = [
  'food', 'fashion', 'tech', 'beauty', 'fitness', 'travel', 
  'lifestyle', 'entertainment', 'education', 'gaming'
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      let query = supabase
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
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.contains('categories', [selectedCategory]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            کمپین‌های فعال
          </h1>
          <p className="text-muted-foreground">
            فرصت‌های همکاری با برندها و کسب‌وکارها
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            همه
          </Badge>
          {ALL_CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </Badge>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : campaigns.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-4">
              {campaigns.length} کمپین فعال
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">کمپینی یافت نشد</h3>
            <p className="text-muted-foreground">
              در حال حاضر کمپین فعالی در این دسته‌بندی وجود ندارد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
