CREATE TABLE IF NOT EXISTS t07_workspaces (
 id uuid PRIMARY KEY REFERENCES t07_user(id) ON DELETE CASCADE,
 onboarded boolean NOT NULL DEFAULT false,version integer NOT NULL DEFAULT 0,
 settings jsonb NOT NULL DEFAULT '{"showTasks":true,"showContent":true}',updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS t07_entities (
 workspace_id uuid NOT NULL REFERENCES t07_workspaces(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK(kind IN ('categories','activities','slots','plans','tasks','records','revisions','reviews','achievements')),
 id uuid NOT NULL,position integer NOT NULL,payload jsonb NOT NULL CHECK(payload->>'id'=id::text),
 PRIMARY KEY(workspace_id,kind,id)
);
CREATE INDEX IF NOT EXISTS t07_entities_id ON t07_entities(id);
CREATE TABLE IF NOT EXISTS t07_requests (
 workspace_id uuid NOT NULL REFERENCES t07_workspaces(id) ON DELETE CASCADE,
 request_key uuid NOT NULL,result_version integer NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(workspace_id,request_key)
);
