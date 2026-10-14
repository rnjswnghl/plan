ALTER TABLE app_workspaces ADD COLUMN IF NOT EXISTS settings jsonb NOT NULL DEFAULT '{"showTasks":true,"showContent":true}';
ALTER TABLE app_entities DROP CONSTRAINT IF EXISTS app_entities_kind_check;
ALTER TABLE app_entities ADD CONSTRAINT app_entities_kind_check CHECK(kind IN ('categories','activities','slots','plans','tasks','records','revisions','reviews','achievements'));
