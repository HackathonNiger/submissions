
-- CAUSE EDITS TABLE
CREATE TABLE IF NOT EXISTS public.cause_edits (
  id uuid primary key default gen_random_uuid(),
  original_cause_id uuid not null references public.causes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text default '' not null,
  category text not null,
  goal integer not null,
  image text,
  multimedia text[] default '{}',
  video_links text[] default '{}',
  days_active integer,
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PETITION EDITS TABLE
CREATE TABLE IF NOT EXISTS public.petition_edits (
  id uuid primary key default gen_random_uuid(),
  original_petition_id uuid not null references public.petitions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text default '' not null,
  category text not null,
  goal integer not null,
  image text,
  multimedia text[] default '{}',
  video_links text[] default '{}',
  days_active integer,
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CAUSE EDIT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.cause_edit_sections (
  id uuid primary key default gen_random_uuid(),
  cause_edit_id uuid not null references public.cause_edits(id) on delete cascade,
  heading text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- PETITION EDIT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.petition_edit_sections (
  id uuid primary key default gen_random_uuid(),
  petition_edit_id uuid not null references public.petition_edits(id) on delete cascade,
  heading text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cause_edits_original_id ON public.cause_edits(original_cause_id);
CREATE INDEX IF NOT EXISTS idx_cause_edits_user_id ON public.cause_edits(user_id);
CREATE INDEX IF NOT EXISTS idx_cause_edits_status ON public.cause_edits(status);
CREATE INDEX IF NOT EXISTS idx_cause_edits_created_at ON public.cause_edits(created_at desc);

CREATE INDEX IF NOT EXISTS idx_petition_edits_original_id ON public.petition_edits(original_petition_id);
CREATE INDEX IF NOT EXISTS idx_petition_edits_user_id ON public.petition_edits(user_id);
CREATE INDEX IF NOT EXISTS idx_petition_edits_status ON public.petition_edits(status);
CREATE INDEX IF NOT EXISTS idx_petition_edits_created_at ON public.petition_edits(created_at desc);

-- Triggers to keep updated_at fresh
CREATE TRIGGER set_cause_edits_updated_at
BEFORE UPDATE ON public.cause_edits
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_petition_edits_updated_at
BEFORE UPDATE ON public.petition_edits
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
