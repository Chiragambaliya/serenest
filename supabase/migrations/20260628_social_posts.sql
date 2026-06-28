-- Social media scheduling table
-- Supports Instagram, LinkedIn, or both platforms per post.

CREATE TABLE IF NOT EXISTS social_posts (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform      text        NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'both')),
  caption       text        NOT NULL,
  hashtags      text,
  image_url     text,
  scheduled_at  timestamptz NOT NULL,
  posted_at     timestamptz,
  status        text        NOT NULL DEFAULT 'scheduled'
                CHECK (status IN ('draft', 'scheduled', 'posted', 'failed', 'partial')),
  linkedin_post_id   text,
  instagram_post_id  text,
  error_message      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS social_posts_status_scheduled ON social_posts (status, scheduled_at);

-- updated_at trigger (reuse pattern from academy_content)
CREATE OR REPLACE FUNCTION set_social_posts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_social_posts_updated_at ON social_posts;
CREATE TRIGGER trg_social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION set_social_posts_updated_at();

-- RLS: only service-role (server) can read/write this table
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- No public access — all access goes through the server using the service-role key
CREATE POLICY "service_role_only" ON social_posts
  USING (false)
  WITH CHECK (false);
