import {
  createEventRepository,
  deleteEventRepository,
  listEventsRepository,
  updateEventRepository,
} from "../repositories/events.repository";

import { orchestrateEventMutation } from "../orchestration/events.orchestration";

export async function getEvents() {
  return listEventsRepository();
}

export async function createEvent(payload: any) {
  return orchestrateEventMutation({
    action: "create",
    payload,
    mutation: () => createEventRepository(payload),
  });
}

export async function updateEvent({
  id,
  payload,
}: any) {
  return orchestrateEventMutation({
    action: "update",
    entityId: id,
    payload,
    mutation: () => updateEventRepository(id, payload),
  });
}

export async function deleteEvent(id: string) {
  console.log("events.delete", { id });

  return orchestrateEventMutation({
    action: "delete",
    entityId: id,
    mutation: () => deleteEventRepository(id),
  });
}
