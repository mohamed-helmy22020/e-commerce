CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_secret TEXT NOT NULL DEFAULT '',
  reset_password_token TEXT NOT NULL DEFAULT '',
  reset_password_expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);
