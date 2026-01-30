export type UserRole = 'business' | 'influencer';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';
export type Category = 
  | 'food' 
  | 'fashion' 
  | 'tech' 
  | 'beauty' 
  | 'fitness' 
  | 'travel' 
  | 'lifestyle' 
  | 'entertainment' 
  | 'education' 
  | 'gaming' 
  | 'sports' 
  | 'music' 
  | 'art' 
  | 'photography' 
  | 'other';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface InfluencerProfile {
  id: string;
  profile_id: string;
  bio: string | null;
  categories: Category[];
  followers_count: number;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  portfolio_urls: string[];
  min_rate: number;
  max_rate: number;
  is_available: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface BusinessProfile {
  id: string;
  profile_id: string;
  company_name: string;
  company_description: string | null;
  industry: string | null;
  website_url: string | null;
  logo_url: string | null;
  portfolio_urls: string[];
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Campaign {
  id: string;
  business_profile_id: string;
  title: string;
  description: string | null;
  categories: Category[];
  budget_min: number;
  budget_max: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  business_profile?: BusinessProfile;
}

export interface CollaborationRequest {
  id: string;
  campaign_id: string | null;
  business_profile_id: string;
  influencer_profile_id: string;
  status: RequestStatus;
  message: string | null;
  proposed_budget: number | null;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  business_profile?: BusinessProfile;
  influencer_profile?: InfluencerProfile;
}

export interface Message {
  id: string;
  collaboration_request_id: string | null;
  sender_profile_id: string;
  recipient_profile_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: Profile;
  recipient_profile?: Profile;
}

export interface Review {
  id: string;
  collaboration_request_id: string;
  reviewer_profile_id: string;
  reviewee_profile_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_profile?: Profile;
}

export interface Notification {
  id: string;
  profile_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

// Category labels in Persian
export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'غذا و آشپزی',
  fashion: 'مد و فشن',
  tech: 'تکنولوژی',
  beauty: 'زیبایی و آرایش',
  fitness: 'ورزش و تناسب اندام',
  travel: 'سفر و گردشگری',
  lifestyle: 'سبک زندگی',
  entertainment: 'سرگرمی',
  education: 'آموزش',
  gaming: 'بازی',
  sports: 'ورزش',
  music: 'موسیقی',
  art: 'هنر',
  photography: 'عکاسی',
  other: 'سایر',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'در انتظار',
  accepted: 'پذیرفته شده',
  rejected: 'رد شده',
  completed: 'تکمیل شده',
};
