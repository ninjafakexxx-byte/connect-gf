export interface Evento {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  color: string | null;
  created_at: string;
}