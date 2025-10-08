-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ==============================
-- PROFILES TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    account_number TEXT,
    bank_name TEXT,
    account_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Add indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, created_at, updated_at)
VALUES (NEW.id, NOW(), NOW());
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ==============================
-- ROLES TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);
-- Add indexes for roles
CREATE INDEX IF NOT EXISTS idx_roles_user_id_lookup ON public.roles(user_id);
CREATE INDEX IF NOT EXISTS idx_roles_role ON public.roles(role);
-- Enable RLS on roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
-- Roles RLS policies
CREATE POLICY "Users can view their own role" ON public.roles FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.roles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can insert roles" ON public.roles FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can update roles" ON public.roles FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can delete roles" ON public.roles FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.roles
        WHERE user_id = auth.uid()
            AND role = 'admin'
    )
);
-- ==============================
-- CAUSES TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS public.causes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    category TEXT NOT NULL,
    goal INTEGER NOT NULL,
    raised INTEGER DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    -- 'pending' | 'approved' | 'rejected'
    rejection_reason TEXT,
    image TEXT,
    shared INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Add indexes for causes
CREATE INDEX IF NOT EXISTS idx_causes_user_id_lookup ON public.causes(user_id);
CREATE INDEX IF NOT EXISTS idx_causes_status ON public.causes(status);
CREATE INDEX IF NOT EXISTS idx_causes_category ON public.causes(category);
CREATE INDEX IF NOT EXISTS idx_causes_created_at ON public.causes(created_at DESC);
-- Enable RLS on causes
ALTER TABLE public.causes ENABLE ROW LEVEL SECURITY;
-- Causes RLS policies
CREATE POLICY "Anyone can view approved causes" ON public.causes FOR
SELECT USING (
        status = 'approved'
        OR auth.uid() = user_id
    );
CREATE POLICY "Authenticated users can create causes" ON public.causes FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own causes" ON public.causes FOR
UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own causes" ON public.causes FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- ==============================
-- DONATIONS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cause_id UUID NOT NULL REFERENCES public.causes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE
    SET NULL,
        amount NUMERIC NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT,
        is_anonymous BOOLEAN DEFAULT false NOT NULL,
        status TEXT DEFAULT 'completed' NOT NULL,
        receipt_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Add indexes for donations
CREATE INDEX IF NOT EXISTS idx_donations_cause_id ON public.donations(cause_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
-- Enable RLS on donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
-- Donations RLS policies
CREATE POLICY "Anyone can view donations for approved causes" ON public.donations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.causes
            WHERE id = cause_id
                AND status = 'approved'
        )
    );
CREATE POLICY "Users can view their own donations" ON public.donations FOR
SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Anyone can create donations" ON public.donations FOR
INSERT TO anon,
    authenticated WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.causes
            WHERE id = cause_id
                AND status = 'approved'
        )
    );
-- ==============================
-- COMMENTS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cause_id UUID NOT NULL REFERENCES public.causes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Add indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_cause_id ON public.comments(cause_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
-- Comments RLS policies
CREATE POLICY "Anyone can view comments on approved causes" ON public.comments FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.causes
            WHERE id = cause_id
                AND (
                    status = 'approved'
                    OR user_id = auth.uid()
                )
        )
    );
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR
UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- ==============================
-- CAUSE_MULTIMEDIA TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS public.cause_multimedia (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cause_id UUID NOT NULL REFERENCES public.causes(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Add indexes for cause_multimedia
CREATE INDEX IF NOT EXISTS idx_cause_multimedia_cause_id ON public.cause_multimedia(cause_id);
CREATE INDEX IF NOT EXISTS idx_cause_multimedia_media_type ON public.cause_multimedia(media_type);
-- Enable RLS on cause_multimedia
ALTER TABLE public.cause_multimedia ENABLE ROW LEVEL SECURITY;
-- Cause_multimedia RLS policies
CREATE POLICY "Anyone can view multimedia for approved causes" ON public.cause_multimedia FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.causes
            WHERE id = cause_id
                AND (
                    status = 'approved'
                    OR user_id = auth.uid()
                )
        )
    );
CREATE POLICY "Users can create multimedia for their own causes" ON public.cause_multimedia FOR
INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.causes
            WHERE id = cause_id
                AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete multimedia from their own causes" ON public.cause_multimedia FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM public.causes
        WHERE id = cause_id
            AND user_id = auth.uid()
    )
);
-- ==============================
-- LOGS TABLE (for admin activity tracking)
-- ==============================
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Add indexes for logs
CREATE INDEX IF NOT EXISTS idx_logs_admin_id ON public.logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
-- Enable RLS on logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
-- Logs RLS policies
CREATE POLICY "Admins can view all logs" ON public.logs FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.roles
            WHERE user_id = auth.uid()
                AND role IN ('admin', 'manager')
        )
    );
CREATE POLICY "Admins can create logs" ON public.logs FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.roles
            WHERE user_id = auth.uid()
                AND role IN ('admin', 'manager')
        )
    );
-- ==============================
-- STORAGE BUCKETS
-- ==============================
-- Create storage bucket for cause images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cause-images', 'cause-images', true) ON CONFLICT (id) DO NOTHING;
-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true) ON CONFLICT (id) DO NOTHING;
-- Storage policies for cause-images
CREATE POLICY "Anyone can view cause images" ON storage.objects FOR
SELECT USING (bucket_id = 'cause-images');
CREATE POLICY "Authenticated users can upload cause images" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (bucket_id = 'cause-images');
CREATE POLICY "Users can update their own cause images" ON storage.objects FOR
UPDATE TO authenticated USING (bucket_id = 'cause-images') WITH CHECK (bucket_id = 'cause-images');
CREATE POLICY "Users can delete their own cause images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cause-images');
-- Storage policies for profile-images
CREATE POLICY "Anyone can view profile images" ON storage.objects FOR
SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Authenticated users can upload profile images" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (
        bucket_id = 'profile-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
CREATE POLICY "Users can update their own profile images" ON storage.objects FOR
UPDATE TO authenticated USING (
        bucket_id = 'profile-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    ) WITH CHECK (
        bucket_id = 'profile-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
CREATE POLICY "Users can delete their own profile images" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name)) [1]
);