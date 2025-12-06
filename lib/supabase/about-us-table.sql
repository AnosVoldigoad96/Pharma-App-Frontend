-- About Us Table
-- This table stores all content for the About Us page
-- Note: Hero section is stored in page_content table (slug: 'about')
-- Note: SEO metadata is stored in seo_metadata table (page_slug: 'about')

-- Migration: Drop hero and SEO columns if they exist (for existing tables)
DO $$ 
BEGIN
  -- Drop hero section columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_heading') THEN
    ALTER TABLE public.about_us DROP COLUMN IF EXISTS hero_heading;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_subtitle') THEN
    ALTER TABLE public.about_us DROP COLUMN IF EXISTS hero_subtitle;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'hero_image') THEN
    ALTER TABLE public.about_us DROP COLUMN IF EXISTS hero_image;
  END IF;
  
  -- Drop SEO columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'meta_title') THEN
    ALTER TABLE public.about_us DROP COLUMN IF EXISTS meta_title;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'meta_description') THEN
    ALTER TABLE public.about_us DROP COLUMN IF EXISTS meta_description;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_us' AND column_name = 'meta_keywords') THEN
    ALTER TABLE public.about_us DROP COLUMN IF EXISTS meta_keywords;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.about_us (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- Mission & Vision
  mission_title text DEFAULT 'Our Mission',
  mission_content text,
  vision_title text DEFAULT 'Our Vision',
  vision_content text,
  
  -- What We Offer Section
  features_section_title text DEFAULT 'What We Offer',
  features_section_subtitle text,
  features jsonb DEFAULT '[]'::jsonb, -- Array of {icon, title, description, link}
  
  -- Core Values Section
  values_section_title text DEFAULT 'Our Core Values',
  values_section_subtitle text,
  values jsonb DEFAULT '[]'::jsonb, -- Array of {icon, title, description}
  
  -- Call to Action Section
  cta_heading text DEFAULT 'Join Our Community',
  cta_description text,
  cta_primary_button_text text DEFAULT 'Get Started',
  cta_primary_button_link text DEFAULT '/signup',
  cta_secondary_button_text text DEFAULT 'Contact Us',
  cta_secondary_button_link text DEFAULT '/contact',
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  
  CONSTRAINT about_us_pkey PRIMARY KEY (id)
);

-- Create a unique constraint to ensure only one about us record exists
-- We'll use a simple approach: only allow one row
CREATE UNIQUE INDEX IF NOT EXISTS about_us_single_row ON public.about_us ((1));

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_about_us_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_about_us_updated_at ON public.about_us;
CREATE TRIGGER update_about_us_updated_at
  BEFORE UPDATE ON public.about_us
  FOR EACH ROW
  EXECUTE FUNCTION update_about_us_updated_at();

-- Insert default/example data
INSERT INTO public.about_us (
  mission_content,
  vision_content,
  features_section_subtitle,
  features,
  values_section_subtitle,
  values,
  cta_description
) VALUES (
  'To provide accessible, reliable, and up-to-date pharmaceutical knowledge to healthcare professionals, students, and the general public. We strive to bridge the gap between complex pharmaceutical information and practical understanding, empowering individuals to make informed decisions about medication and health.',
  'To become the leading global platform for pharmaceutical education and knowledge sharing. We envision a world where accurate pharmaceutical information is freely accessible to everyone, fostering better health outcomes and informed decision-making across all communities.',
  'Comprehensive tools and resources to support your pharmaceutical learning journey',
  '[
    {
      "icon": "BookOpen",
      "title": "Digital Library",
      "description": "Access a vast collection of pharmaceutical books, research papers, and educational materials.",
      "link": "/books"
    },
    {
      "icon": "Calculator",
      "title": "Calculation Tools",
      "description": "Use our interactive pharmaceutical calculators for dosage, conversions, and clinical calculations.",
      "link": "/tools"
    },
    {
      "icon": "MessageSquare",
      "title": "Expert Articles",
      "description": "Read in-depth articles, research summaries, and expert insights on pharmaceutical topics.",
      "link": "/blogs"
    },
    {
      "icon": "Users",
      "title": "Community Forums",
      "description": "Join discussions, ask questions, and share knowledge with fellow professionals and students.",
      "link": "/threads"
    }
  ]'::jsonb,
  'The principles that guide everything we do',
  '[
    {
      "icon": "Shield",
      "title": "Accuracy",
      "description": "We are committed to providing accurate, evidence-based information verified by pharmaceutical experts."
    },
    {
      "icon": "Heart",
      "title": "Accessibility",
      "description": "We believe pharmaceutical knowledge should be accessible to everyone, regardless of background or location."
    },
    {
      "icon": "Users",
      "title": "Community",
      "description": "We foster a collaborative environment where professionals and learners can share knowledge and grow together."
    }
  ]'::jsonb,
  'Whether you''re a healthcare professional, student, or someone interested in pharmaceutical knowledge, we welcome you to explore, learn, and contribute to our growing community.'
) ON CONFLICT DO NOTHING;

-- Add RLS (Row Level Security) policies if needed
-- Enable RLS
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Allow public read access to about_us" ON public.about_us;
CREATE POLICY "Allow public read access to about_us"
  ON public.about_us
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admins to manage about_us" ON public.about_us;
-- Policy: Allow only admins to insert/update/delete
-- Note: Adjust this based on your authentication setup
CREATE POLICY "Allow admins to manage about_us"
  ON public.about_us
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.public_users
      WHERE public_users.user_id = auth.uid()
      AND public_users.role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE public.about_us IS 'Stores all content for the About Us page. Hero section is in page_content table (slug: about), SEO is in seo_metadata table (page_slug: about)';
COMMENT ON COLUMN public.about_us.features IS 'JSONB array of feature objects with icon, title, description, and link';
COMMENT ON COLUMN public.about_us.values IS 'JSONB array of value objects with icon, title, and description';

