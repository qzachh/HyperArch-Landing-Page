/*
  # HyperArch Landing Page Database Schema

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `company` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `preferred_solution` (text, required)
      - `pain_points` (text array, for selected pain points)
      - `note` (text, optional)
      - `created_at` (timestamp)
    
    - `slideshow_images`
      - `id` (uuid, primary key)
      - `category` (text, either 'compliance' or 'documentation')
      - `image_url` (text, URL to the image)
      - `alt_text` (text, alternative text for accessibility)
      - `order_index` (integer, for ordering images in slideshow)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to slideshow_images
    - Add policies for public insert access to contact_submissions
    - Add policies for authenticated admin access to manage data

  3. Sample Data
    - Insert sample slideshow images for both categories
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_solution text NOT NULL,
  pain_points text[] DEFAULT '{}',
  note text,
  created_at timestamptz DEFAULT now()
);

-- Create slideshow_images table
CREATE TABLE IF NOT EXISTS slideshow_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('compliance', 'documentation')),
  image_url text NOT NULL,
  alt_text text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE slideshow_images ENABLE ROW LEVEL SECURITY;

-- Policies for contact_submissions
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for slideshow_images
CREATE POLICY "Anyone can read slideshow images"
  ON slideshow_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage slideshow images"
  ON slideshow_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample slideshow images for compliance category
INSERT INTO slideshow_images (category, image_url, alt_text, order_index) VALUES
  ('compliance', 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800', 'AI-powered compliance checking interface showing building code analysis', 1),
  ('compliance', 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=800', 'Dashboard displaying real-time rule analysis and compliance status', 2),
  ('compliance', 'https://images.pexels.com/photos/7688468/pexels-photo-7688468.jpeg?auto=compress&cs=tinysrgb&w=800', 'Code validation results with highlighted non-compliant areas', 3),
  ('compliance', 'https://images.pexels.com/photos/8849407/pexels-photo-8849407.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smart suggestion panel providing intelligent compliance fixes', 4);

-- Insert sample slideshow images for documentation category
INSERT INTO slideshow_images (category, image_url, alt_text, order_index) VALUES
  ('documentation', 'https://images.pexels.com/photos/7688340/pexels-photo-7688340.jpeg?auto=compress&cs=tinysrgb&w=800', 'Format transformation interface converting architectural plans', 1),
  ('documentation', 'https://images.pexels.com/photos/8849298/pexels-photo-8849298.jpeg?auto=compress&cs=tinysrgb&w=800', 'Automated drawing generator creating submission-specific formats', 2),
  ('documentation', 'https://images.pexels.com/photos/7688471/pexels-photo-7688471.jpeg?auto=compress&cs=tinysrgb&w=800', 'Multi-output preview showing different document formats', 3),
  ('documentation', 'https://images.pexels.com/photos/8849410/pexels-photo-8849410.jpeg?auto=compress&cs=tinysrgb&w=800', 'Custom template builder for architectural documentation', 4);