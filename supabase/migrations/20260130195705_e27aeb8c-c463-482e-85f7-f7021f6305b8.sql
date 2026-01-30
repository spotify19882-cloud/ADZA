-- Fix the overly permissive notification insert policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a proper notification insert policy
CREATE POLICY "Authenticated users can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);