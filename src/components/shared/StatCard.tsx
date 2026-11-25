import { Users } from "lucide-react";
export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}
