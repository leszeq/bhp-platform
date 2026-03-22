-- USERS (rozszerzenie auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'user',
  created_at timestamp default now()
);

-- COURSES
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric default 0,
  is_active boolean default true,
  created_at timestamp default now()
);

-- LESSONS
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text,
  content text,
  order_index int
);

-- QUESTION BANK
create table public.question_bank (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  question_text text,
  correct_answer text,
  wrong_answers jsonb,
  difficulty text,
  is_verified boolean default false,
  created_by text,
  created_at timestamp default now()
);

-- EXAMS
create table public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  status text default 'in_progress',
  score int,
  started_at timestamp default now(),
  finished_at timestamp
);

-- EXAM QUESTIONS
create table public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade,
  question_id uuid references question_bank(id),
  selected_answer text,
  is_correct boolean
);

-- CERTIFICATES
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  exam_id uuid references exams(id),
  certificate_url text,
  verification_code text,
  issued_at timestamp default now()
);

-- =============================================================
-- TRIGGER: Automatyczne tworzenie profilu po rejestracji
-- Wklej poniższy blok OSOBNO w SQL Editor po uruchomieniu tabel
-- =============================================================

-- Funkcja tworząca profil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger wywoływany po rejestracji użytkownika
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PAYMENTS
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  status text default 'pending',
  created_at timestamp default now()
);

-- COMPANIES (B2B)
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text,
  owner_id uuid references profiles(id),
  created_at timestamp default now()
);

-- COMPANY USERS (B2B)
create table public.company_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  user_id uuid references profiles(id)
);

-- INVITATIONS (Employee Onboarding)
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_id uuid references companies(id),
  course_id uuid references courses(id),
  token text unique not null,
  status text default 'pending', -- pending / accepted / expired
  expires_at timestamp,
  created_at timestamp default now(),
  email_sent_at timestamp,
  reminder_count int default 0
);

-- Rozszerzenie profili dla B2B Magic Links
alter table public.profiles add column company_id uuid references companies(id);

-- USER COURSES (B2B Employee Progress)
create table public.user_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  status text default 'not_started',
  created_at timestamp default now()
);
