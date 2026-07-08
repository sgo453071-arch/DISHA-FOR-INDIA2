-- ─── ROW LEVEL SECURITY (RLS) ───────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_reviews ENABLE ROW LEVEL SECURITY;

-- ─── POLICIES ───────────────────────────────────────────────────

-- Helper function to check if user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check the authenticated user's role in the public.users table
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. USERS Table Policies
-- Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 2. ORGANIZATIONS
-- Public read for active organizations
CREATE POLICY "Public read organizations" ON public.organizations
  FOR SELECT USING (is_active = true AND is_deleted = false);

CREATE POLICY "Owners and Admins manage organizations" ON public.organizations
  FOR ALL USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.organization_admins 
      WHERE organization_id = public.organizations.id 
      AND user_id = auth.uid()
    ) OR public.is_admin()
  );

-- 3. PROGRAMS
-- Public read for active programs
CREATE POLICY "Public read programs" ON public.programs
  FOR SELECT USING (status = 'PUBLISHED' AND is_deleted = false);

CREATE POLICY "Volunteers can read programs" ON public.programs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage programs" ON public.programs
  FOR ALL USING (public.is_admin() OR created_by = auth.uid());

-- 4. PROGRAM APPLICATIONS
-- Users can see and update their own applications
CREATE POLICY "Users view own applications" ON public.program_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users insert own applications" ON public.program_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins view all applications" ON public.program_applications
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins manage applications" ON public.program_applications
  FOR UPDATE USING (public.is_admin());

-- 5. CONTRIBUTIONS
-- Volunteers read and create their own contributions
CREATE POLICY "Users view own contributions" ON public.contributions
  FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "Users create contributions" ON public.contributions
  FOR INSERT WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Users update own pending contributions" ON public.contributions
  FOR UPDATE USING (submitted_by = auth.uid() AND status = 'PENDING');

-- Admins read and update all contributions
CREATE POLICY "Admins manage contributions" ON public.contributions
  FOR ALL USING (public.is_admin() OR admin_assigned = auth.uid());

-- Public read for featured/published contributions
CREATE POLICY "Public view featured contributions" ON public.contributions
  FOR SELECT USING (visibility = 'PUBLIC' AND status = 'APPROVED');

-- 6. CONTRIBUTION VERSIONS & FILES
CREATE POLICY "Users view own versions" ON public.contribution_versions
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Admins view all versions" ON public.contribution_versions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users view own files" ON public.contribution_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contribution_versions 
      WHERE id = version_id AND uploaded_by = auth.uid()
    )
  );

CREATE POLICY "Admins view all files" ON public.contribution_files
  FOR SELECT USING (public.is_admin());

-- 7. REVIEWS
-- Only Admins and assigned reviewers can insert/update reviews
CREATE POLICY "Admins manage reviews" ON public.contribution_reviews
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users view own reviews" ON public.contribution_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contributions 
      WHERE id = contribution_id AND submitted_by = auth.uid()
    )
  );
