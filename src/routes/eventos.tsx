import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { logAudit } from "@/lib/audit";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { DateTimeInputBR } from "@/components/ui/date-input-br";
import { toast } from "sonner";

import { EVENT_COLORS } from "@/modules/eventos/constants";
import { UpcomingEvents } from "@/modules/eventos/components/upcoming-events";
import { useEvents } from "@/modules/eventos/hooks/use-events";
import { useDeleteEvent } from "@/modules/events/mutations/use-delete-event";
import { createEvent, updateEvent } from "@/modules/eventos/services/events.service";
import type { Evento, EventoFormData } from "@/modules/eventos/types";

export const Route = createFileRoute("/eventos")({
  component: EventosPageGuarded,
});

function EventosPageGuarded() {
  return (
    <RoleGuard roles={["lider", "admin"]}>
      <EventosPage />
    </RoleGuard>
  );
}

function EventosPage() {
  const { user, isAdmin, isLider } = useAuth();
  const { theme } = useTheme();
  const isBlackTheme = theme === "black";
  const { events, loading, loadEvents } = useEvents();
  const deleteMutation = useDeleteEvent();

  const [cursor, setCursor] = useState(new Date());
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState<EventoFormData>({
    title: "",
    description: "",
    location: "",
    event_date: "",
    color: "blue",
  });

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), {
      weekStartsOn: 0,
    });

    const end = endOfWeek(endOfMonth(cursor), {
      weekStartsOn: 0,
    });

    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Evento[]>();

    events.forEach((event) => {
      const key = format(parseISO(event.event_date), "yyyy-MM-dd");

      map.set(key, [...(map.get(key) || []), event]);
    });

    return map;
  }, [events]);

  function resetForm() {
    setForm({
      title: "",
      description: "",
      location: "",
      event_date: "",
      color: "blue",
    });
  }

  async function handleSave() {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (!form.title || !form.event_date) {
      toast.error("Preencha título e data");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      event_date: new Date(form.event_date).toISOString(),
      color: form.color,
    };

    if (editing) {
      const { error } = await (updateEvent as any)(editing.id, payload);

      if (error) {
        toast.error("Erro ao atualizar evento");
        return;
      }

      await logAudit("evento.update", "events", editing.id, {
        ...payload,
        entityName: payload.title,
        module: "Eventos",
      });

      toast.success("Evento atualizado");
    } else {
      const { data, error } = await createEvent(payload);

      if (error) {
        toast.error("Erro ao criar evento");
        return;
      }

      await logAudit("evento.create", "events", data.id, {
        ...payload,
        entityName: payload.title,
        module: "Eventos",
      });

      toast.success("Evento criado");
    }

    setOpenForm(false);
    setEditing(null);
    resetForm();
    await loadEvents();
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      console.log("[DELETE HOOK]", { id: deleteId });

      await deleteMutation.mutateAsync(deleteId);

      toast.success("Evento excluído");

      setDeleteId(null);
      await loadEvents();
    } catch (error) {
      console.error("[DELETE ERROR]", error);
      toast.error("Erro ao excluir evento");
    }
  }

  function openCreateModal() {
    setEditing(null);

    setForm({
      title: "",
      description: "",
      location: "",
      event_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      color: "blue",
    });

    setOpenForm(true);
  }

  function openEditModal(event: Evento) {
    setEditing(event);

    setForm({
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      event_date: event.event_date.slice(0, 16),
      color: event.color || "blue",
    });

    setOpenForm(true);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Calendário de Eventos"
        subtitle="Organize encontros e atividades"
        accent="blue"
        icon={<CalendarIcon className="h-6 w-6" />}
        actions={
          isLider ? (
            <Button
              onClick={openCreateModal}
              className={cn(
                "gap-2",
                isBlackTheme &&
                  "border border-[rgba(214,168,95,0.24)] bg-[linear-gradient(180deg,rgba(28,25,18,0.98),rgba(13,13,12,0.98))] text-[rgba(240,210,138,0.96)] shadow-[0_0_0_1px_rgba(214,168,95,0.08),0_14px_32px_rgba(0,0,0,0.34)] hover:bg-[linear-gradient(180deg,rgba(36,31,21,0.98),rgba(16,15,13,0.98))] hover:text-[rgba(255,232,176,0.98)]",
              )}
            >
              <Plus className="h-4 w-4" />
              Novo evento
            </Button>
          ) : null
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize">
              {format(cursor, "MMMM yyyy", { locale: ptBR })}
            </h2>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCursor(subMonths(cursor, 1))}>
                ←
              </Button>

              <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
                Hoje
              </Button>

              <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
                →
              </Button>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const dayEvents = eventsByDay.get(key) || [];

                  return (
                    <div
                      key={key}
                      className={`min-h-[90px] rounded-xl border p-1 text-xs ${
                        isSameMonth(day, cursor)
                          ? "border-border bg-background"
                          : "border-transparent opacity-40"
                      } ${isSameDay(day, new Date()) ? (isBlackTheme ? "ring-2 ring-[rgba(214,168,95,0.62)]" : "ring-2 ring-blue-500") : ""}`}
                    >
                      <div className="mb-1 text-[11px] font-semibold">{format(day, "d")}</div>

                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => openEditModal(event)}
                            className={`block w-full truncate rounded border px-1 py-0.5 text-left text-[10px] ${EVENT_COLORS[event.color || "blue"]}`}
                          >
                            {event.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        <UpcomingEvents events={events} isAdmin={!!isAdmin} onDelete={setDeleteId} />
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar evento" : "Novo evento"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <DateTimeInputBR
                value={form.event_date}
                onChange={(value) => setForm({ ...form, event_date: value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Local</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>

              <div className="flex gap-2">
                {Object.keys(EVENT_COLORS).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`h-7 w-7 rounded-full border-2 ${EVENT_COLORS[color]} ${
                      form.color === color ? "scale-110 border-white" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpenForm(false)}>
                Cancelar
              </Button>

              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir evento?</AlertDialogTitle>

            <AlertDialogDescription>Esta ação não poderá ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
