import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Sparkles } from 'lucide-react';
import { Campaign, CATEGORY_LABELS } from '@/types/database.types';

interface CampaignCardProps {
  campaign: Campaign & { 
    business_profile?: { 
      company_name: string; 
      logo_url: string | null;
      profile?: { full_name: string };
    } 
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'توافقی';
    return `${min.toLocaleString('fa-IR')} - ${max.toLocaleString('fa-IR')} تومان`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'نامشخص';
    return new Date(date).toLocaleDateString('fa-IR');
  };

  return (
    <Link to={`/campaign/${campaign.id}`}>
      <Card className="glass-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group h-full">
        {campaign.is_featured && (
          <div className="absolute top-0 right-0 gradient-bg text-primary-foreground px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            ویژه
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {campaign.business_profile?.logo_url ? (
              <img 
                src={campaign.business_profile.logo_url} 
                alt={campaign.business_profile.company_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground font-bold">
                {campaign.business_profile?.company_name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {campaign.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {campaign.business_profile?.company_name}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {campaign.description || 'بدون توضیحات'}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {campaign.categories?.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {CATEGORY_LABELS[cat]}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>بودجه: {formatPrice(campaign.budget_min, campaign.budget_max)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
              </span>
            </div>
          </div>

          <Badge 
            variant={campaign.is_active ? 'default' : 'secondary'}
            className={campaign.is_active ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}
          >
            {campaign.is_active ? 'فعال' : 'غیرفعال'}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
