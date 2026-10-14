-- Draft migration. Not executed. Apply through a migration runner in a transaction.
CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  title text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL CHECK (period_end >= period_start),
  priority smallint NOT NULL CHECK (priority BETWEEN 1 AND 3),
  success_criteria text NOT NULL,
  estimated_minutes integer NOT NULL CHECK (estimated_minutes >= 0),
  carried_improvement text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE plan_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plans(id),
  version integer NOT NULL CHECK (version > 0),
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, version)
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plans(id),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  due_date date,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  priority smallint NOT NULL CHECK (priority BETWEEN 1 AND 3),
  tags text[] NOT NULL DEFAULT '{}',
  estimated_minutes integer NOT NULL CHECK (estimated_minutes >= 0),
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'done')),
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (scheduled_end IS NULL OR (scheduled_start IS NOT NULL AND scheduled_end >= scheduled_start))
);

CREATE TABLE execution_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id),
  request_key uuid NOT NULL UNIQUE,
  started_at timestamptz NOT NULL,
  ended_at timestamptz NOT NULL CHECK (ended_at >= started_at),
  actual_minutes integer NOT NULL CHECK (actual_minutes >= 0),
  blocked_reason text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE task_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id),
  request_key uuid NOT NULL UNIQUE,
  target_status text NOT NULL CHECK (target_status IN ('todo', 'done')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL UNIQUE REFERENCES plans(id),
  reflection text NOT NULL DEFAULT '',
  improvement text NOT NULL DEFAULT '',
  next_plan_id uuid REFERENCES plans(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (next_plan_id IS NULL OR next_plan_id <> plan_id)
);

CREATE INDEX plans_workspace_period ON plans(workspace_id, period_start);
CREATE INDEX tasks_plan_due ON tasks(plan_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX tasks_plan_schedule ON tasks(plan_id, scheduled_start) WHERE deleted_at IS NULL;
CREATE INDEX executions_task_start ON execution_records(task_id, started_at);
CREATE INDEX status_events_task_time ON task_status_events(task_id, created_at);
