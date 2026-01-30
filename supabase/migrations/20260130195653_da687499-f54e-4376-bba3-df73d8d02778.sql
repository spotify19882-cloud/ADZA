-- Create role enum
CREATE TYPE public.user_role AS ENUM ('business', 'influencer');

-- Create request status enum  
CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- Create categories enum
CREATE TYPE public.category AS ENUM ('food', 'fashion', 'tech', 'beauty', 'fitness', 'travel', 'lifestyle', 'entertainment', 'education', 'gaming', 'sports', 'music', 'art', 'photography', 'other');

-- Profiles table (core user info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Influencer profiles extension
CREATE TABLE public.influencer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  categories category[] DEFAULT '{}',
  followers_count INTEGER DEFAULT 0,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  twitter_url TEXT,
  portfolio_urls TEXT[] DEFAULT '{}',
  min_rate INTEGER DEFAULT 0,
  max_rate INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Business profiles extension
CREATE TABLE public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  industry TEXT,
  website_url TEXT,
  logo_url TEXT,
  portfolio_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaigns
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  categories category[] DEFAULT '{}',
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Collaboration requests
CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
  influencer_profile_id UUID REFERENCES public.influencer_profiles(id) ON DELETE CASCADE NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  message TEXT,
  proposed_budget INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages (for real-time chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_request_id UUID REFERENCES public.collaboration_requests(id) ON DELETE CASCADE,
  sender_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_request_id UUID REFERENCES public.collaboration_requests(id) ON DELETE CASCADE NOT NULL,
  reviewer_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table for admin functionality
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  )
$$;

-- Helper function: Get profile ID for a user
CREATE OR REPLACE FUNCTION public.get_profile_id(user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE profiles.user_id = $1
$$;

-- Helper function: Check if user owns a profile
CREATE OR REPLACE FUNCTION public.owns_profile(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = profile_id AND user_id = auth.uid()
  )
$$;

-- Helper function: Check if user can access collaboration
CREATE OR REPLACE FUNCTION public.can_access_collaboration(collab_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collaboration_requests cr
    JOIN public.business_profiles bp ON cr.business_profile_id = bp.id
    JOIN public.influencer_profiles ip ON cr.influencer_profile_id = ip.id
    WHERE cr.id = collab_id
    AND (
      public.owns_profile(bp.profile_id) OR 
      public.owns_profile(ip.profile_id)
    )
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for influencer_profiles
CREATE POLICY "Anyone can view influencer profiles" ON public.influencer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own influencer profile" ON public.influencer_profiles
  FOR INSERT WITH CHECK (public.owns_profile(profile_id));

CREATE POLICY "Users can update their own influencer profile" ON public.influencer_profiles
  FOR UPDATE USING (public.owns_profile(profile_id));

-- RLS Policies for business_profiles
CREATE POLICY "Anyone can view business profiles" ON public.business_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own business profile" ON public.business_profiles
  FOR INSERT WITH CHECK (public.owns_profile(profile_id));

CREATE POLICY "Users can update their own business profile" ON public.business_profiles
  FOR UPDATE USING (public.owns_profile(profile_id));

-- RLS Policies for campaigns
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns
  FOR SELECT USING (true);

CREATE POLICY "Business owners can insert campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_profiles bp
      WHERE bp.id = business_profile_id AND public.owns_profile(bp.profile_id)
    )
  );

CREATE POLICY "Business owners can update their campaigns" ON public.campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.business_profiles bp
      WHERE bp.id = business_profile_id AND public.owns_profile(bp.profile_id)
    )
  );

-- RLS Policies for collaboration_requests
CREATE POLICY "Participants can view collaboration requests" ON public.collaboration_requests
  FOR SELECT USING (public.can_access_collaboration(id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Business owners can create collaboration requests" ON public.collaboration_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_profiles bp
      WHERE bp.id = business_profile_id AND public.owns_profile(bp.profile_id)
    )
  );

CREATE POLICY "Participants can update collaboration requests" ON public.collaboration_requests
  FOR UPDATE USING (public.can_access_collaboration(id));

-- RLS Policies for messages
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (
    public.owns_profile(sender_profile_id) OR public.owns_profile(recipient_profile_id)
  );

CREATE POLICY "Authenticated users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    public.owns_profile(sender_profile_id)
  );

CREATE POLICY "Users can update their message read status" ON public.messages
  FOR UPDATE USING (public.owns_profile(recipient_profile_id));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Participants can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    public.owns_profile(reviewer_profile_id) AND
    EXISTS (
      SELECT 1 FROM public.collaboration_requests cr
      WHERE cr.id = collaboration_request_id AND cr.status = 'completed'
    )
  );

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.is_admin(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (public.owns_profile(profile_id));

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (public.owns_profile(profile_id));

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON public.influencer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaboration_requests_updated_at BEFORE UPDATE ON public.collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update influencer rating
CREATE OR REPLACE FUNCTION public.update_influencer_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  count_rating INTEGER;
  inf_profile_id UUID;
BEGIN
  -- Get the influencer profile id from the reviewee
  SELECT ip.id INTO inf_profile_id
  FROM public.influencer_profiles ip
  JOIN public.profiles p ON ip.profile_id = p.id
  WHERE p.id = NEW.reviewee_profile_id AND p.role = 'influencer';

  IF inf_profile_id IS NOT NULL THEN
    SELECT AVG(r.rating), COUNT(r.id)
    INTO avg_rating, count_rating
    FROM public.reviews r
    JOIN public.profiles p ON r.reviewee_profile_id = p.id
    WHERE p.id = NEW.reviewee_profile_id;

    UPDATE public.influencer_profiles
    SET rating_avg = COALESCE(avg_rating, 0), rating_count = COALESCE(count_rating, 0)
    WHERE id = inf_profile_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_rating_after_review AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_influencer_rating();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_influencer_profiles_categories ON public.influencer_profiles USING GIN(categories);
CREATE INDEX idx_influencer_profiles_rating ON public.influencer_profiles(rating_avg DESC);
CREATE INDEX idx_influencer_profiles_followers ON public.influencer_profiles(followers_count DESC);
CREATE INDEX idx_campaigns_business_id ON public.campaigns(business_profile_id);
CREATE INDEX idx_campaigns_active ON public.campaigns(is_active);
CREATE INDEX idx_collaboration_requests_status ON public.collaboration_requests(status);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_profile_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_notifications_profile ON public.notifications(profile_id);