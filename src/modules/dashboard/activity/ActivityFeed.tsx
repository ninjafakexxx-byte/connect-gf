const activities = [
  "Novo evento criado",
  "Oferta registrada",
  "Novo membro adicionado",
  "Meta atualizada",
];

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">
        Atividade recente
      </h2>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity}
            className="rounded-xl border p-3 text-sm"
          >
            {activity}
          </div>
        ))}
      </div>
    </div>
  );
}