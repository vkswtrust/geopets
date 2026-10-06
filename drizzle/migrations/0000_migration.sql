
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE SEQUENCE public.gpc_seq START 1;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  name text,
  email text,
  gpc_id text UNIQUE NOT NULL DEFAULT ('GPC' || lpad(nextval('public.gpc_seq')::text, 3, '0')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  gpc_id text,
  type text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  animal_id uuid,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text, age text, gender text, location text,
  rescue_story text, health_status text, vaccination_status text,
  sterilization_status text, behaviour text, description text,
  geopet_id text UNIQUE,
  adoption_status text NOT NULL DEFAULT 'Available',
  photos text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.geopet_records (
  animal_id uuid PRIMARY KEY REFERENCES public.animals(id) ON DELETE CASCADE,
  medical_record text, vaccination_history text, rescue_history text,
  sponsor_info text, recovery_timeline text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL, email text, amount numeric NOT NULL,
  method text, reference text, notes text,
  donated_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.admin_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text, email text,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid, actor_email text,
  action text NOT NULL, table_name text, record_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles, public.user_roles, public.submissions, public.admin_access_requests TO authenticated;
GRANT UPDATE, DELETE ON public.profiles, public.submissions, public.admin_access_requests TO authenticated;
GRANT INSERT ON public.submissions, public.admin_access_requests TO authenticated;
GRANT INSERT ON public.submissions TO anon;
GRANT INSERT, DELETE ON public.user_roles TO authenticated;
GRANT SELECT ON public.animals, public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.animals, public.site_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.geopet_records, public.donations TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geopet_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own or admin read profiles" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage profiles" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin add roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin remove roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "anon submit" ON public.submissions FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "user submit" ON public.submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own or admin read subs" ON public.submissions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update subs" ON public.submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete subs" ON public.submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read published animals" ON public.animals FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin insert animals" ON public.animals FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update animals" ON public.animals FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete animals" ON public.animals FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin geopet" ON public.geopet_records FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin donations" ON public.donations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete settings" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "user request admin" ON public.admin_access_requests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'Pending');
CREATE POLICY "own or admin read requests" ON public.admin_access_requests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update requests" ON public.admin_access_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete requests" ON public.admin_access_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin read audit" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  IF lower(NEW.email) = 'vkswtrust@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_submission_gpc()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.status := 'Pending';
  IF NEW.user_id IS NOT NULL THEN
    SELECT gpc_id INTO NEW.gpc_id FROM public.profiles WHERE id = NEW.user_id;
  ELSE
    NEW.gpc_id := NULL;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER submissions_gpc BEFORE INSERT ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.set_submission_gpc();

CREATE OR REPLACE FUNCTION public.on_admin_request_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'Approved' AND OLD.status <> 'Approved' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.user_id, 'admin') ON CONFLICT DO NOTHING;
  ELSIF NEW.status <> 'Approved' AND OLD.status = 'Approved' THEN
    DELETE FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'admin';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER admin_request_update AFTER UPDATE ON public.admin_access_requests FOR EACH ROW EXECUTE FUNCTION public.on_admin_request_update();

CREATE OR REPLACE FUNCTION public.audit_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE rid text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(),'admin') THEN RETURN COALESCE(NEW, OLD); END IF;
  rid := COALESCE(to_jsonb(NEW), to_jsonb(OLD))->>(CASE WHEN TG_TABLE_NAME='site_settings' THEN 'key' WHEN TG_TABLE_NAME='geopet_records' THEN 'animal_id' ELSE 'id' END);
  INSERT INTO public.audit_logs (actor_id, actor_email, action, table_name, record_id)
  VALUES (auth.uid(), (SELECT email FROM public.profiles WHERE id = auth.uid()), TG_OP, TG_TABLE_NAME, rid);
  RETURN COALESCE(NEW, OLD);
END $$;
CREATE TRIGGER audit_animals AFTER INSERT OR UPDATE OR DELETE ON public.animals FOR EACH ROW EXECUTE FUNCTION public.audit_change();
CREATE TRIGGER audit_geopet AFTER INSERT OR UPDATE OR DELETE ON public.geopet_records FOR EACH ROW EXECUTE FUNCTION public.audit_change();
CREATE TRIGGER audit_donations AFTER INSERT OR UPDATE OR DELETE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.audit_change();
CREATE TRIGGER audit_settings AFTER INSERT OR UPDATE OR DELETE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.audit_change();
CREATE TRIGGER audit_subs AFTER UPDATE OR DELETE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.audit_change();
CREATE TRIGGER audit_requests AFTER UPDATE OR DELETE ON public.admin_access_requests FOR EACH ROW EXECUTE FUNCTION public.audit_change();
CREATE TRIGGER audit_roles AFTER INSERT OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.audit_change();

CREATE POLICY "admin upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
