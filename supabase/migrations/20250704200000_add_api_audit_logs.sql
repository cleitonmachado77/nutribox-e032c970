-- Create API audit logs table for security monitoring
create table if not exists public.api_audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  endpoint text not null,
  method text not null,
  status integer not null,
  instance_name text,
  timestamp timestamptz default now() not null
);

-- Enable RLS
alter table public.api_audit_logs enable row level security;

-- Create policy for users to only see their own logs
create policy "Users can only view their own audit logs"
  on public.api_audit_logs
  for select
  using (auth.uid() = user_id);

-- Create policy for inserting audit logs
create policy "Users can insert their own audit logs"
  on public.api_audit_logs
  for insert
  with check (auth.uid() = user_id);

-- Create index for performance
create index if not exists idx_api_audit_logs_user_id on public.api_audit_logs(user_id);
create index if not exists idx_api_audit_logs_timestamp on public.api_audit_logs(timestamp);