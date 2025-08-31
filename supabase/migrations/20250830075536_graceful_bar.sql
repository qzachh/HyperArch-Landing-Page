/*
  # Add Version Control Hub Images

  1. Changes
    - Add version control category images to slideshow_images table
    - Update category check constraint to include 'version_control'

  2. New Data
    - Insert sample slideshow images for version control category
*/

-- Update the check constraint to include version_control
ALTER TABLE slideshow_images DROP CONSTRAINT IF EXISTS slideshow_images_category_check;
ALTER TABLE slideshow_images ADD CONSTRAINT slideshow_images_category_check 
  CHECK (category IN ('compliance', 'documentation', 'version_control'));

-- Insert sample slideshow images for version control category
INSERT INTO slideshow_images (category, image_url, alt_text, order_index) VALUES
  ('version_control', 'https://images.pexels.com/photos/7688467/pexels-photo-7688467.jpeg?auto=compress&cs=tinysrgb&w=800', 'Version control dashboard showing project timeline and branches', 1),
  ('version_control', 'https://images.pexels.com/photos/8849296/pexels-photo-8849296.jpeg?auto=compress&cs=tinysrgb&w=800', 'Interactive mind-map visualization of drawing versions and branches', 2),
  ('version_control', 'https://images.pexels.com/photos/7688469/pexels-photo-7688469.jpeg?auto=compress&cs=tinysrgb&w=800', 'Change detection interface highlighting modifications between versions', 3),
  ('version_control', 'https://images.pexels.com/photos/8849408/pexels-photo-8849408.jpeg?auto=compress&cs=tinysrgb&w=800', 'Multi-user collaboration hub with comments and change tracking', 4);