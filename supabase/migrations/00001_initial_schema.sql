-- Gatherly Phase 1: Initial schema
-- Run this in Supabase Dashboard → SQL Editor, or via Supabase CLI: supabase db push

-- =============================================================================
-- INVITATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id text NOT NULL DEFAULT 'elegant-rose',
  content jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  slug text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Own invitations: full access
CREATE POLICY "Users can manage own invitations"
  ON public.invitations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public: read published invitation by slug (for /i/[slug])
CREATE POLICY "Public can read published invitations"
  ON public.invitations
  FOR SELECT
  USING (status = 'published');

-- =============================================================================
-- GUESTS (for guest-list mode: named invitees per invitation)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(invitation_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_slug ON public.guests(invitation_id, slug);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Invitation owner can manage guests
CREATE POLICY "Invitation owner can manage guests"
  ON public.guests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = guests.invitation_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = guests.invitation_id AND user_id = auth.uid()
    )
  );

-- Public can read guests for published invitation (e.g. /i/[slug] guest list)
CREATE POLICY "Public can read guests of published invitations"
  ON public.guests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = guests.invitation_id AND status = 'published'
    )
  );

-- =============================================================================
-- RSVPS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_slug text,
  guest_name text,
  response text NOT NULL DEFAULT 'pending' CHECK (response IN ('pending', 'attending', 'declined')),
  extra_guests int NOT NULL DEFAULT 0 CHECK (extra_guests >= 0),
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_guest ON public.rsvps(invitation_id, guest_slug) WHERE guest_slug IS NOT NULL;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public RSVP form)
CREATE POLICY "Anyone can submit RSVP"
  ON public.rsvps
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = invitation_id AND status = 'published'
    )
  );

-- Invitation owner can read/update/delete RSVPs
CREATE POLICY "Invitation owner can manage RSVPs"
  ON public.rsvps
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = rsvps.invitation_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = rsvps.invitation_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- WISHES (guest messages on invitation)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON public.wishes(invitation_id);

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public wish form on /i/[slug])
CREATE POLICY "Anyone can submit wish"
  ON public.wishes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = invitation_id AND status = 'published'
    )
  );

-- Invitation owner can read/delete; public can read for published invitation
CREATE POLICY "Invitation owner can manage wishes"
  ON public.wishes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = wishes.invitation_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = wishes.invitation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read wishes of published invitations"
  ON public.wishes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE id = wishes.invitation_id AND status = 'published'
    )
  );

-- =============================================================================
-- UPDATED_AT TRIGGER (invitations, rsvps)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invitations_updated_at ON public.invitations;
CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS rsvps_updated_at ON public.rsvps;
CREATE TRIGGER rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
