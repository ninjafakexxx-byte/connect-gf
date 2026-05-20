import { Clock, MapPin, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Evento } from '../types';

interface Props {
  events: Evento[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export function UpcomingEvents({ events, isAdmin, onDelete }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-2xl border border-border bg-card p-4'
    >
      <h2 className='mb-4 text-sm font-semibold'>Próximos eventos</h2>

      <div className='space-y-3'>
        {events.slice(0, 5).map((event) => (
          <div
            key={event.id}
            className='rounded-xl border border-border p-3'
          >
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{event.title}</p>

                <p className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                  <Clock className='h-3 w-3' />
                  {format(parseISO(event.event_date), 'dd/MM/yyyy HH:mm')}
                </p>

                {event.location && (
                  <p className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                    <MapPin className='h-3 w-3' />
                    {event.location}
                  </p>
                )}
              </div>

              {isAdmin && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onDelete(event.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
