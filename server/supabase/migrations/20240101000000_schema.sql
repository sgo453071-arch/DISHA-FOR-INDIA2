-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS & ROLES ──────────────────────────────────────────────

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'VOLUNTEER',
    phone VARCHAR(20),
    gender VARCHAR(20),
    date_of_birth DATE,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    points INT DEFAULT 0,
    coins INT DEFAULT 0,
    profile_photo TEXT,
    about TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID, -- Self-referencing FK added below
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.users 
  ADD CONSTRAINT fk_users_deleted_by FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON DELETE SET NULL;

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    social_links JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.organization_admins (
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ─── PROGRAMS ──────────────────────────────────────────────

CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category VARCHAR(100),
    mode VARCHAR(50) DEFAULT 'OFFLINE',
    status VARCHAR(50) DEFAULT 'DRAFT',
    max_volunteers INT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.program_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'PENDING',
    form_responses JSONB DEFAULT '{}'::jsonb,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ─── CONTRIBUTIONS ──────────────────────────────────────────────

CREATE TABLE public.contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    visibility VARCHAR(50) DEFAULT 'PRIVATE',
    hours_worked INT DEFAULT 0,
    total_coins_awarded INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    submitted_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    admin_assigned UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.contribution_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    notes TEXT,
    github_url TEXT,
    figma_url TEXT,
    canva_url TEXT,
    google_drive_url TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.contribution_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID NOT NULL REFERENCES public.contribution_versions(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    public_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    size INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.contribution_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contribution_id UUID NOT NULL REFERENCES public.contributions(id) ON DELETE CASCADE,
    version_id UUID REFERENCES public.contribution_versions(id) ON DELETE SET NULL,
    reviewed_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    feedback TEXT,
    internal_notes TEXT,
    coins_awarded INT DEFAULT 0,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ─── INDEXES ──────────────────────────────────────────────

-- Users
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_is_deleted ON public.users(is_deleted);
CREATE INDEX idx_users_points ON public.users(points DESC);

-- Organizations
CREATE INDEX idx_orgs_owner ON public.organizations(owner_id);
CREATE INDEX idx_orgs_is_active ON public.organizations(is_active);

-- Programs
CREATE INDEX idx_programs_status ON public.programs(status);
CREATE INDEX idx_programs_category ON public.programs(category);
CREATE INDEX idx_programs_created_by ON public.programs(created_by);

-- Contributions
CREATE INDEX idx_contribs_status ON public.contributions(status);
CREATE INDEX idx_contribs_submitted_by ON public.contributions(submitted_by);
CREATE INDEX idx_contribs_admin ON public.contributions(admin_assigned);

-- Updates Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contribs_updated_at BEFORE UPDATE ON public.contributions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
