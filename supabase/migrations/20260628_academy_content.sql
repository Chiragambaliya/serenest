-- Academy content table: daily announcements, program updates, events
-- Managed via /admin (Academy → Content tab)

CREATE TABLE IF NOT EXISTS academy_content (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT        NOT NULL DEFAULT 'announcement',  -- announcement | program_update | event
  title       TEXT        NOT NULL,
  body        TEXT,
  link        TEXT,
  link_label  TEXT        DEFAULT 'Learn more',
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  pinned      BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Only active items are visible to the public
ALTER TABLE academy_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active" ON academy_content
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- Service role (used by Express backend) bypasses RLS by default

-- Auto-update updated_at on every write
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_academy_content_updated_at
  BEFORE UPDATE ON academy_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
