-- Document entities have validated references and fields in lib/model.ts.
-- Shared public workspace for T06; private authentication is not enabled.
CREATE TABLE IF NOT EXISTS app_workspaces (
 id uuid PRIMARY KEY,
 onboarded boolean NOT NULL DEFAULT false,
 version integer NOT NULL DEFAULT 0,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_entities (
 workspace_id uuid NOT NULL REFERENCES app_workspaces(id),
 kind text NOT NULL CHECK(kind IN ('categories','activities','slots','plans','tasks','records','revisions','reviews')),
 id uuid NOT NULL,
 position integer NOT NULL,
 payload jsonb NOT NULL CHECK(payload->>'id'=id::text),
 PRIMARY KEY(workspace_id,kind,id)
);
CREATE TABLE IF NOT EXISTS app_requests (
 workspace_id uuid NOT NULL REFERENCES app_workspaces(id),
 request_key uuid NOT NULL,
 result_version integer NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(workspace_id,request_key)
);
