-- SQL Migration: Create features table for website features
-- Run this in your Supabase SQL Editor

-- Create table for website features
CREATE TABLE IF NOT EXISTS public.features (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT features_pkey PRIMARY KEY (id)
);

-- Create index for display order
CREATE INDEX IF NOT EXISTS idx_features_display_order ON public.features(display_order);

-- Create index for active features
CREATE INDEX IF NOT EXISTS idx_features_is_active ON public.features(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_features_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_features_updated_at ON public.features;
CREATE TRIGGER update_features_updated_at
  BEFORE UPDATE ON public.features
  FOR EACH ROW
  EXECUTE FUNCTION update_features_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active features
DROP POLICY IF EXISTS "Allow public read access to active features" ON public.features;
CREATE POLICY "Allow public read access to active features"
ON public.features
FOR SELECT
TO public
USING (is_active = true);

-- Add comments
COMMENT ON TABLE public.features IS 'Stores website features displayed in sticky scroll reveal component';
COMMENT ON COLUMN public.features.title IS 'Feature title/heading';
COMMENT ON COLUMN public.features.description IS 'Feature description text';
COMMENT ON COLUMN public.features.image IS 'URL to feature image';
COMMENT ON COLUMN public.features.display_order IS 'Order in which features should be displayed (lower numbers first)';
COMMENT ON COLUMN public.features.is_active IS 'Whether the feature is active and should be displayed';

