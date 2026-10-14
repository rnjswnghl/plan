-- Atomic server-side save for HTTP-only Workers. Existing tables and records retained.
CREATE OR REPLACE FUNCTION sugang_save(p_workspace uuid,p_state jsonb,p_version integer,p_key uuid)
RETURNS integer LANGUAGE plpgsql AS $function$
DECLARE current_version integer; receipt integer; kind_name text; item jsonb; item_position integer;
BEGIN
 INSERT INTO app_workspaces(id) VALUES(p_workspace) ON CONFLICT DO NOTHING;
 SELECT version INTO current_version FROM app_workspaces WHERE id=p_workspace FOR UPDATE;
 SELECT result_version INTO receipt FROM app_requests WHERE workspace_id=p_workspace AND request_key=p_key;
 IF FOUND THEN RETURN receipt; END IF;
 IF current_version<>p_version THEN RAISE EXCEPTION 'SUGANG_CONFLICT'; END IF;
 -- Protect immutable execution/history even if a caller bypasses the application checks.
 IF EXISTS(SELECT 1 FROM app_entities e WHERE e.workspace_id=p_workspace AND e.kind IN ('records','revisions') AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(p_state->e.kind,'[]'::jsonb)) n WHERE n->>'id'=e.id::text AND n=e.payload)) THEN RAISE EXCEPTION 'SUGANG_HISTORY'; END IF;
 FOREACH kind_name IN ARRAY ARRAY['categories','activities','slots','plans','tasks','records','revisions','reviews','achievements'] LOOP
  DELETE FROM app_entities e WHERE e.workspace_id=p_workspace AND e.kind=kind_name AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements(COALESCE(p_state->kind_name,'[]'::jsonb)) n WHERE n->>'id'=e.id::text);
  item_position:=0;
  FOR item IN SELECT value FROM jsonb_array_elements(COALESCE(p_state->kind_name,'[]'::jsonb)) LOOP
   INSERT INTO app_entities(workspace_id,kind,id,position,payload) VALUES(p_workspace,kind_name,(item->>'id')::uuid,item_position,item)
   ON CONFLICT(workspace_id,kind,id) DO UPDATE SET payload=EXCLUDED.payload,position=EXCLUDED.position WHERE app_entities.payload IS DISTINCT FROM EXCLUDED.payload OR app_entities.position<>EXCLUDED.position;
   item_position:=item_position+1;
  END LOOP;
 END LOOP;
 UPDATE app_workspaces SET version=current_version+1,onboarded=(p_state->>'onboarded')::boolean,settings=COALESCE(p_state->'settings','{"showTasks":true,"showContent":true}'::jsonb),updated_at=now() WHERE id=p_workspace;
 INSERT INTO app_requests(workspace_id,request_key,result_version) VALUES(p_workspace,p_key,current_version+1);
 RETURN current_version+1;
END;
$function$;
