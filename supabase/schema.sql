-- DevFolio CMS — Supabase schema (v1.2.0)
--
-- Run this once in your Supabase project's SQL editor (Dashboard → SQL
-- Editor → New query → paste → Run). It creates one table per content
-- collection plus a single-row profile table, and locks them down:
--   * anyone (including logged-out visitors) can READ — the public portfolio
--   * only a SIGNED-IN user can WRITE — the admin, via Supabase Auth
--
-- After running it: Authentication → Users → Add user, create your admin
-- account (email + password). Then in the DevFolio admin (Settings → Cloud
-- sync) paste the project URL + anon key from Settings → API, sign in with
-- that account, and press "Push local content to cloud".
--
-- Never use the service_role key in the site. The anon key is safe to ship:
-- it only grants what these policies allow.

create table if not exists devfolio_projects (
  id text primary key,
  data jsonb not null,
  sort int not null default 0
);

create table if not exists devfolio_skills (
  id text primary key,
  data jsonb not null,
  sort int not null default 0
);

create table if not exists devfolio_experience (
  id text primary key,
  data jsonb not null,
  sort int not null default 0
);

create table if not exists devfolio_posts (
  id text primary key,
  data jsonb not null,
  sort int not null default 0
);

create table if not exists devfolio_documents (
  id text primary key,
  data jsonb not null,
  sort int not null default 0
);

create table if not exists devfolio_profile (
  id int primary key,
  data jsonb not null
);

alter table devfolio_projects enable row level security;
alter table devfolio_skills enable row level security;
alter table devfolio_experience enable row level security;
alter table devfolio_posts enable row level security;
alter table devfolio_documents enable row level security;
alter table devfolio_profile enable row level security;

-- Public read on every table.
create policy "Public read" on devfolio_projects for select using (true);
create policy "Public read" on devfolio_skills for select using (true);
create policy "Public read" on devfolio_experience for select using (true);
create policy "Public read" on devfolio_posts for select using (true);
create policy "Public read" on devfolio_documents for select using (true);
create policy "Public read" on devfolio_profile for select using (true);

-- Only signed-in users can write.
create policy "Signed-in write" on devfolio_projects
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Signed-in write" on devfolio_skills
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Signed-in write" on devfolio_experience
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Signed-in write" on devfolio_posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Signed-in write" on devfolio_documents
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "Signed-in write" on devfolio_profile
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
