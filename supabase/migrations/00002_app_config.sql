-- App config: card languages and packages. Managed by admins.
CREATE TABLE IF NOT EXISTS public.app_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS app_config_updated_at ON public.app_config;
CREATE TRIGGER app_config_updated_at
  BEFORE UPDATE ON public.app_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public read for config (used by /api/v1/config)
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app_config"
  ON public.app_config
  FOR SELECT
  USING (true);

-- Only service role or admin can write (via API with admin check)
-- For now, we allow no direct write from anon/authenticated.
-- The config API will use service role for writes when admin-authenticated.
-- (Admin routes will use server-side Supabase client with service role for updates.)

-- Seed defaults
INSERT INTO public.app_config (key, value) VALUES
  ('card_languages', '[
    {"value": "bahasa-melayu", "label": "Bahasa Melayu"},
    {"value": "english", "label": "English"},
    {"value": "arabic", "label": "Arabic"}
  ]'::jsonb),
  ('packages', '[
    {"value": "standard", "label": "Standard"},
    {"value": "premium", "label": "Premium"},
    {"value": "gold", "label": "Gold", "isPopular": true}
  ]'::jsonb)
ON CONFLICT (key) DO NOTHING;
