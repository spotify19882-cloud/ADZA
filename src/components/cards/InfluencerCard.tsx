import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Instagram, Youtube } from 'lucide-react';
import { InfluencerProfile, CATEGORY_LABELS } from '@/types/database.types';

interface InfluencerCardProps {
  influencer: InfluencerProfile & { profile: { full_name: string; avatar_url: string | null } };
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'توافقی';
    if (min === max) return `${min.toLocaleString('fa-IR')} تومان`;
    return `${min.toLocaleString('fa-IR')} - ${max.toLocaleString('fa-IR')} تومان`;
  };

  return (
    <Link to={`/influencer/${influencer.id}`}>
      <Card className="glass-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
              <AvatarImage src={influencer.profile?.avatar_url || ''} />
              <AvatarFallback className="gradient-bg text-primary-foreground text-xl">
                {influencer.profile?.full_name?.charAt(0) || 'I'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {influencer.profile?.full_name}
              </h3>
              
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(influencer.followers_count)}
                </span>
                {influencer.rating_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {influencer.rating_avg.toFixed(1)}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {influencer.bio || 'بدون توضیحات'}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {influencer.categories?.slice(0, 3).map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {CATEGORY_LABELS[cat]}
                  </Badge>
                ))}
                {influencer.categories?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{influencer.categories.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <span className="text-sm font-medium text-primary">
                  {formatPrice(influencer.min_rate, influencer.max_rate)}
                </span>
                <div className="flex gap-2">
                  {influencer.instagram_url && (
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                  )}
                  {influencer.youtube_url && (
                    <Youtube className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {influencer.is_available && (
                <Badge className="absolute top-4 left-4 bg-green-500/20 text-green-500 border-green-500/30">
                  آماده همکاری
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
