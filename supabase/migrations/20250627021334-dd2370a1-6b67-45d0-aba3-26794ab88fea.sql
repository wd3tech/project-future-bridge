
-- Create enum types
CREATE TYPE public.user_role AS ENUM ('STUDENT', 'COMPANY', 'SCHOOL_ADMIN', 'TEACHER');
CREATE TYPE public.job_type AS ENUM ('INTERNSHIP', 'APPRENTICE', 'FULL_TIME', 'PART_TIME', 'FREELANCE');
CREATE TYPE public.application_status AS ENUM ('APPLIED', 'VIEWED', 'IN_PROGRESS', 'REJECTED', 'HIRED');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create school_profiles table
CREATE TABLE public.school_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  about TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teacher_profiles table
CREATE TABLE public.teacher_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  school_id UUID REFERENCES public.school_profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_profiles table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  school_id UUID REFERENCES public.school_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_profiles table
CREATE TABLE public.company_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  validated_by_teacher_id UUID REFERENCES public.teacher_profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_skills junction table
CREATE TABLE public.project_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(project_id, skill_id)
);

-- Create job_postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.company_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type job_type NOT NULL,
  requirements TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_skills junction table
CREATE TABLE public.job_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(job_id, skill_id)
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'APPLIED',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for student_profiles
CREATE POLICY "Anyone can view student profiles" ON public.student_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can manage their own profile" ON public.student_profiles FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for company_profiles
CREATE POLICY "Anyone can view company profiles" ON public.company_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Companies can manage their own profile" ON public.company_profiles FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for school_profiles
CREATE POLICY "Anyone can view school profiles" ON public.school_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Schools can manage their own profile" ON public.school_profiles FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for teacher_profiles
CREATE POLICY "Anyone can view teacher profiles" ON public.teacher_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage their own profile" ON public.teacher_profiles FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for projects
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can manage their own projects" ON public.projects 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles 
      WHERE id = projects.student_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for job_postings
CREATE POLICY "Anyone can view active job postings" ON public.job_postings FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Companies can manage their own job postings" ON public.job_postings 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.company_profiles 
      WHERE id = job_postings.company_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for applications
CREATE POLICY "Students can view their own applications" ON public.applications 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles 
      WHERE id = applications.student_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Companies can view applications to their jobs" ON public.applications 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.job_postings jp
      JOIN public.company_profiles cp ON jp.company_id = cp.id
      WHERE jp.id = applications.job_id AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Students can create applications" ON public.applications 
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.student_profiles 
      WHERE id = applications.student_id AND user_id = auth.uid()
    )
  );

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    CAST(COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT') AS user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default skills
INSERT INTO public.skills (name) VALUES 
('HTML/CSS'),
('JavaScript'),
('Python'),
('React'),
('Node.js'),
('Design Gráfico'),
('Marketing Digital'),
('Excel Avançado'),
('Photoshop'),
('Figma'),
('Git/GitHub'),
('SQL'),
('WordPress'),
('Edição de Vídeo'),
('Redes Sociais');
