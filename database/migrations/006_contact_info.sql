-- Add contact information columns to site_settings table

ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS contact_address text,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN public.site_settings.contact_email IS 'Contact email address for the organization';
COMMENT ON COLUMN public.site_settings.contact_phone IS 'Contact phone number for the organization';
COMMENT ON COLUMN public.site_settings.contact_address IS 'Physical address for the organization';
COMMENT ON COLUMN public.site_settings.social_links IS 'JSONB array of social media links: { platform, url, icon (image url) }';

