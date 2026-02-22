-- Templates: backend-managed invitation designs with default audio
CREATE TABLE IF NOT EXISTS public.templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  thumbnail_url text NOT NULL,
  themes text[] NOT NULL DEFAULT '{}',
  styles text[] NOT NULL DEFAULT '{}',
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  tags text[] NOT NULL DEFAULT '{}',
  colors jsonb NOT NULL,
  design jsonb NOT NULL,
  envelope_intro jsonb,
  default_audio_url text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_active ON public.templates(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_templates_sort ON public.templates(sort_order);

DROP TRIGGER IF EXISTS templates_updated_at ON public.templates;
CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active templates"
  ON public.templates
  FOR SELECT
  USING (active = true);

-- Seed from current lib/templates (Wedding templates get default audio)
INSERT INTO public.templates (id, name, thumbnail_url, themes, styles, tier, tags, colors, design, envelope_intro, default_audio_url, sort_order) VALUES
  ('elegant-rose', 'Elegant Rose', '/templates/elegant-rose.svg', ARRAY['Wedding'], ARRAY['Floral','Elegant'], 'premium', ARRAY['rose','blush','romantic','feminine'],
   '{"bg":"#fdf2f4","text":"#4a2030","accent":"#c77d8a","muted":"#9c7080"}'::jsonb,
   '{"fontPairing":"serif","headingWeight":"400","letterSpacing":"0.04em","decorator":"floral-corners","heroLayout":"centered","divider":"ornament","bgPattern":"radial-gradient(circle at 20% 20%, #c77d8a10 0%, transparent 50%), radial-gradient(circle at 80% 80%, #c77d8a10 0%, transparent 50%)","borderRadius":"16px","accentShape":"circle"}'::jsonb,
   NULL, 'https://www.youtube.com/watch?v=0J7R20ycaU4&t=7', 0),
  ('golden-arch', 'Golden Arch', '/templates/golden-arch.svg', ARRAY['Wedding','E-Day'], ARRAY['Elegant','Modern'], 'premium', ARRAY['gold','arch','art deco','luxury'],
   '{"bg":"#faf6ee","text":"#3a2e1a","accent":"#b8943e","muted":"#8a7d60"}'::jsonb,
   '{"fontPairing":"serif","headingWeight":"600","letterSpacing":"0.06em","decorator":"geometric-border","heroLayout":"centered","divider":"diamond","bgPattern":null,"borderRadius":"0px","accentShape":"arch"}'::jsonb,
   NULL, 'https://www.youtube.com/watch?v=0J7R20ycaU4&t=7', 1),
  ('sakura-bloom', 'Sakura Bloom', '/templates/sakura-bloom.svg', ARRAY['Birthday'], ARRAY['Cute','Floral'], 'free', ARRAY['cherry blossom','pink','japanese','spring'],
   '{"bg":"#fef0f5","text":"#5c2040","accent":"#e891ab","muted":"#a87088"}'::jsonb,
   '{"fontPairing":"sans","headingWeight":"600","letterSpacing":"0.02em","decorator":"dots-scatter","heroLayout":"centered","divider":"dots","bgPattern":"radial-gradient(circle at 15% 10%, #e891ab15 0%, transparent 30%), radial-gradient(circle at 85% 15%, #e891ab12 0%, transparent 25%), radial-gradient(circle at 50% 90%, #e891ab10 0%, transparent 35%)","borderRadius":"20px","accentShape":"circle"}'::jsonb,
   '{"type":"envelopeIntro","variant":"classicWax","sealInitials":"SB"}'::jsonb, NULL, 2),
  ('midnight-garden', 'Midnight Garden', '/templates/midnight-garden.svg', ARRAY['Wedding','E-Day'], ARRAY['Elegant','Modern'], 'premium', ARRAY['dark','botanical','navy','moody'],
   '{"bg":"#0f1a2e","text":"#e8edf4","accent":"#5b8a72","muted":"#7a8ea0"}'::jsonb,
   '{"fontPairing":"serif","headingWeight":"400","letterSpacing":"0.05em","decorator":"line-minimal","heroLayout":"centered","divider":"line","bgPattern":"linear-gradient(180deg, #5b8a7208 0%, transparent 30%, transparent 70%, #5b8a7208 100%)","borderRadius":"12px","accentShape":"diamond"}'::jsonb,
   NULL, 'https://www.youtube.com/watch?v=0J7R20ycaU4&t=7', 3),
  ('corporate-slate', 'Corporate Slate', '/templates/corporate-slate.svg', ARRAY['Corporate','Open House'], ARRAY['Minimal','Modern'], 'free', ARRAY['business','professional','clean','formal'],
   '{"bg":"#f5f5f5","text":"#1a1a2e","accent":"#4a6fa5","muted":"#6b7280"}'::jsonb,
   '{"fontPairing":"sans","headingWeight":"700","letterSpacing":"0.01em","decorator":"line-minimal","heroLayout":"left-aligned","divider":"line","bgPattern":null,"borderRadius":"8px","accentShape":"square"}'::jsonb,
   NULL, NULL, 4),
  ('tropical-fiesta', 'Tropical Fiesta', '/templates/tropical-fiesta.svg', ARRAY['Birthday','Open House'], ARRAY['Modern','Cute'], 'free', ARRAY['tropical','party','palm','vibrant','fun'],
   '{"bg":"#fef9f0","text":"#2a1f14","accent":"#e07850","muted":"#8a7060"}'::jsonb,
   '{"fontPairing":"sans","headingWeight":"700","letterSpacing":"0.01em","decorator":"dots-scatter","heroLayout":"centered","divider":"dots","bgPattern":"radial-gradient(circle at 10% 90%, #e0785012 0%, transparent 40%), radial-gradient(circle at 90% 10%, #e0785012 0%, transparent 40%)","borderRadius":"16px","accentShape":"circle"}'::jsonb,
   NULL, NULL, 5),
  ('rustic-kraft', 'Rustic Kraft', '/templates/rustic-kraft.svg', ARRAY['Wedding'], ARRAY['Traditional','Floral'], 'free', ARRAY['rustic','kraft','botanical','vintage','wildflower'],
   '{"bg":"#f5ede0","text":"#3e3428","accent":"#8b7355","muted":"#7a6e58"}'::jsonb,
   '{"fontPairing":"serif","headingWeight":"400","letterSpacing":"0.03em","decorator":"floral-corners","heroLayout":"centered","divider":"ornament","bgPattern":null,"borderRadius":"4px","accentShape":"square"}'::jsonb,
   NULL, 'https://www.youtube.com/watch?v=0J7R20ycaU4&t=7', 6),
  ('baby-clouds', 'Baby Clouds', '/templates/baby-clouds.svg', ARRAY['Baby/Aqiqah'], ARRAY['Cute','Minimal'], 'premium', ARRAY['baby','shower','aqiqah','pastel','dreamy'],
   '{"bg":"#f0f6fc","text":"#2a3a50","accent":"#7ab0d4","muted":"#7090a8"}'::jsonb,
   '{"fontPairing":"sans","headingWeight":"600","letterSpacing":"0.02em","decorator":"star-scatter","heroLayout":"centered","divider":"dots","bgPattern":"radial-gradient(circle at 30% 20%, #7ab0d412 0%, transparent 35%), radial-gradient(circle at 70% 75%, #7ab0d410 0%, transparent 30%)","borderRadius":"24px","accentShape":"circle"}'::jsonb,
   NULL, NULL, 7),
  ('kids-jungle-01', 'Kids Jungle', '/templates/kids-jungle.svg', ARRAY['Birthday','Baby/Aqiqah'], ARRAY['Cute','Modern'], 'free', ARRAY['jungle','kids','animal','fun','adventure'],
   '{"bg":"#f5f8e8","text":"#2d3a1e","accent":"#6b8e4e","muted":"#7a8a65"}'::jsonb,
   '{"fontPairing":"sans","headingWeight":"600","letterSpacing":"0.02em","decorator":"dots-scatter","heroLayout":"centered","divider":"dots","bgPattern":"radial-gradient(circle at 20% 80%, #6b8e4e15 0%, transparent 40%), radial-gradient(circle at 80% 20%, #6b8e4e12 0%, transparent 35%)","borderRadius":"16px","accentShape":"circle"}'::jsonb,
   NULL, NULL, 8),
  ('islamic-geometric', 'Islamic Geometric', '/templates/islamic-geometric.svg', ARRAY['Wedding','E-Day','Open House'], ARRAY['Traditional','Elegant'], 'premium', ARRAY['islamic','geometric','arabesque','ornate'],
   '{"bg":"#f2f7f0","text":"#1a3020","accent":"#2e7d48","muted":"#507060"}'::jsonb,
   '{"fontPairing":"serif","headingWeight":"600","letterSpacing":"0.04em","decorator":"arabesque-frame","heroLayout":"centered","divider":"diamond","bgPattern":null,"borderRadius":"2px","accentShape":"arch"}'::jsonb,
   NULL, 'https://www.youtube.com/watch?v=0J7R20ycaU4&t=7', 9)
ON CONFLICT (id) DO NOTHING;
