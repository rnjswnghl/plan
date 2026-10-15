create table "t07_user" ("id" uuid default pg_catalog.gen_random_uuid() not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create table "t07_session" ("id" uuid default pg_catalog.gen_random_uuid() not null primary key, "expiresAt" timestamptz not null, "token" text not null unique, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null, "ipAddress" text, "userAgent" text, "userId" uuid not null references "t07_user" ("id") on delete cascade);

create table "t07_account" ("id" uuid default pg_catalog.gen_random_uuid() not null primary key, "accountId" text not null, "providerId" text not null, "userId" uuid not null references "t07_user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz, "scope" text, "password" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null);

create table "t07_verification" ("id" uuid default pg_catalog.gen_random_uuid() not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamptz not null, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create table "t07_rate_limit" ("id" uuid default pg_catalog.gen_random_uuid() not null primary key, "key" text not null unique, "count" integer not null, "lastRequest" bigint not null);

create index "t07_session_userId_idx" on "t07_session" ("userId");

create index "t07_account_userId_idx" on "t07_account" ("userId");

create index "t07_verification_identifier_idx" on "t07_verification" ("identifier");