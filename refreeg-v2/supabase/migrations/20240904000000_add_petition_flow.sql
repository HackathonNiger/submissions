-- Enable required extensions
create extension if not exists pgcrypto;

-- PETITIONS TABLE
create table if not exists public.petitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text default '' not null,
  category text not null,
  goal integer not null,
  raised integer not null default 0,
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason text,
  image text,
  multimedia text[] default '{}',
  shared integer not null default 0,
  days_active integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_petitions_user_id on public.petitions(user_id);
create index if not exists idx_petitions_status on public.petitions(status);
create index if not exists idx_petitions_category on public.petitions(category);
create index if not exists idx_petitions_created_at on public.petitions(created_at desc);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_petitions_updated_at on public.petitions;
create trigger set_petitions_updated_at
before update on public.petitions
for each row execute function public.set_updated_at();

-- PETITION SECTIONS TABLE
create table if not exists public.petition_sections (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions(id) on delete cascade,
  heading text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_petition_sections_petition_id on public.petition_sections(petition_id);

-- SIGNATURES TABLE
create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  amount numeric not null,
  name text not null,
  email text not null,
  message text,
  is_anonymous boolean not null default false,
  status text not null default 'completed', -- flexible text to match app usage
  receipt_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_signatures_petition_id on public.signatures(petition_id);
create index if not exists idx_signatures_user_id on public.signatures(user_id);
create index if not exists idx_signatures_created_at on public.signatures(created_at desc);

-- Ensure one authenticated user can sign a petition only once
create unique index if not exists uq_signatures_petition_user
  on public.signatures(petition_id, user_id)
  where user_id is not null;

-- Row Level Security
alter table public.petitions enable row level security;
alter table public.petition_sections enable row level security;
alter table public.signatures enable row level security;

-- Policies for petitions
do $$ begin
  -- SELECT: anyone can view approved petitions; owners can view their own
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petitions' and policyname = 'Select approved petitions or own'
  ) then
    create policy "Select approved petitions or own" on public.petitions
      for select
      using (
        status = 'approved' or auth.uid() = user_id
      );
  end if;

  -- INSERT: only authenticated users creating for themselves
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petitions' and policyname = 'Insert own petitions'
  ) then
    create policy "Insert own petitions" on public.petitions
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  -- UPDATE: only owners can update
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petitions' and policyname = 'Update own petitions'
  ) then
    create policy "Update own petitions" on public.petitions
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  -- DELETE: only owners can delete
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petitions' and policyname = 'Delete own petitions'
  ) then
    create policy "Delete own petitions" on public.petitions
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

-- Policies for petition_sections (follow parent petition ownership)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petition_sections' and policyname = 'Select sections for approved or own petitions'
  ) then
    create policy "Select sections for approved or own petitions" on public.petition_sections
      for select
      using (
        exists (
          select 1 from public.petitions p
          where p.id = petition_id and (p.status = 'approved' or p.user_id = auth.uid())
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petition_sections' and policyname = 'Insert sections for own petitions'
  ) then
    create policy "Insert sections for own petitions" on public.petition_sections
      for insert
      to authenticated
      with check (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petition_sections' and policyname = 'Update sections for own petitions'
  ) then
    create policy "Update sections for own petitions" on public.petition_sections
      for update
      to authenticated
      using (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'petition_sections' and policyname = 'Delete sections for own petitions'
  ) then
    create policy "Delete sections for own petitions" on public.petition_sections
      for delete
      to authenticated
      using (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid()
        )
      );
  end if;
end $$;

-- Policies for signatures
do $$ begin
  -- SELECT: anyone can read signatures of approved petitions
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'signatures' and policyname = 'Select signatures for approved petitions'
  ) then
    create policy "Select signatures for approved petitions" on public.signatures
      for select
      using (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.status = 'approved'
        )
      );
  end if;

  -- INSERT: allow anonymous and authenticated users to sign any approved petition
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'signatures' and policyname = 'Insert signatures for approved petitions'
  ) then
    create policy "Insert signatures for approved petitions" on public.signatures
      for insert
      to anon, authenticated
      with check (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.status = 'approved'
        )
      );
  end if;

  -- INSERT: also allow owners to collect signatures while pending/rejected from their own view if needed
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'signatures' and policyname = 'Insert signatures for own petitions'
  ) then
    create policy "Insert signatures for own petitions" on public.signatures
      for insert
      to authenticated
      with check (
        exists (
          select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid()
        )
      );
  end if;

  -- Users can select their own signatures
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'signatures' and policyname = 'Select own signatures'
  ) then
    create policy "Select own signatures" on public.signatures
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;
end $$;

-- STORAGE: Ensure bucket for petition videos exists
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'petition-videos'
  ) then
    insert into storage.buckets (id, name, public)
    values ('petition-videos', 'petition-videos', true);
  end if;
end
$$;

-- Storage policies for petition-videos (public read, authenticated write)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow public read on petition-videos'
  ) then
    create policy "Allow public read on petition-videos"
      on storage.objects for select
      using (bucket_id = 'petition-videos');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow authenticated upload to petition-videos'
  ) then
    create policy "Allow authenticated upload to petition-videos"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'petition-videos');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow authenticated update own petition-videos'
  ) then
    create policy "Allow authenticated update own petition-videos"
      on storage.objects for update to authenticated
      using (bucket_id = 'petition-videos')
      with check (bucket_id = 'petition-videos');
  end if;
end $$;

-- Petition comments table
create table if not exists public.petition_comments (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  parent_id uuid references public.petition_comments(id) on delete cascade,
  is_edited boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_petition_comments_petition on public.petition_comments(petition_id);
create index if not exists idx_petition_comments_parent on public.petition_comments(parent_id);
create index if not exists idx_petition_comments_created on public.petition_comments(created_at desc);

alter table public.petition_comments enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='petition_comments' and policyname='Select petition comments for approved or own petitions'
  ) then
    create policy "Select petition comments for approved or own petitions" on public.petition_comments
      for select using (
        exists (
          select 1 from public.petitions p
          where p.id = petition_id and (p.status = 'approved' or p.user_id = auth.uid())
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='petition_comments' and policyname='Insert petition comments'
  ) then
    create policy "Insert petition comments" on public.petition_comments
      for insert to authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='petition_comments' and policyname='Update own petition comments'
  ) then
    create policy "Update own petition comments" on public.petition_comments
      for update to authenticated
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='petition_comments' and policyname='Delete own petition comments'
  ) then
    create policy "Delete own petition comments" on public.petition_comments
      for delete to authenticated
      using (user_id = auth.uid());
  end if;
end $$;


