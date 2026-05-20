interface EventCardProps {
  title: string;
  date: string;
}

export function EventCard({
  title,
  date,
}: EventCardProps) {
  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs text-muted-foreground">
        {date}
      </p>
    </div>
  );
}
