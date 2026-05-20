import { externalSupabase as supabase } from "@/integrations/external-supabase/client";

export async function listEventsRepository() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function createEventRepository(payload: any) {
  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateEventRepository(id: string, payload: any) {
  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteEventRepository(id: string) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}
