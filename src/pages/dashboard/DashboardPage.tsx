import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Users,
  ArrowUpRight,
  CalendarCheck,
} from "lucide-react";
import type { Appointment, AppointmentStatus, Patient, Section } from "../../types";
import { patientById } from "../../utils/formatters";
import { StatCard } from "../../components/shared/StatCard";
import { AppointmentRow } from "../../components/shared/AppointmentRow";
import { EmptyState } from "../../components/shared/EmptyState";
export function DashboardPage({
  doctor,
  appointments,
  patients,
  pending,
  drafts,
  onNavigate,
  onPatient,
  onAppointment,
  onStart,
}: {
  doctor: { name: string; role: string; initials: string; color: string };
  appointments: Appointment[];
  patients: Patient[];
  pending: number;
  drafts: number;
  onNavigate: (s: Section) => void;
  onPatient: (id: number) => void;
  onAppointment: (id: number, s: AppointmentStatus) => void;
  onStart: (id: number, appointmentId?: number) => void;
}) {
  const active = appointments.filter((a) => a.status !== "Cancelado");
  const next = active.filter((a) => a.status !== "Atendido").slice(0, 4);
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">MARTES, 24 DE NOVIEMBRE DE 2026</div>
          <h1>
            Buen día, {doctor.name.split(" ")[1]} <span className="wave">✦</span>
          </h1>
          <p>Este es el resumen de tu consultorio para hoy.</p>
        </div>
        <button className="btn primary" onClick={() => onNavigate("Agenda")}>
          <CalendarDays size={16} /> Ver agenda completa
        </button>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={CalendarCheck}
          label="Turnos de hoy"
          value={String(active.length)}
          note="En tu agenda"
          tone="blue"
        />
        <StatCard
          icon={Clock3}
          label="Pendientes"
          value={String(pending)}
          note="Por confirmar"
          tone="amber"
        />
        <StatCard
          icon={Users}
          label="Pacientes"
          value={String(patients.length)}
          note="En tu registro"
          tone="green"
        />
        <StatCard
          icon={FileText}
          label="Borradores"
          value={String(drafts)}
          note="Consultas sin finalizar"
          tone="violet"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel agenda-panel">
          <div className="panel-heading">
            <div>
              <h2>Agenda de hoy</h2>
              <p>Tu actividad programada</p>
            </div>
            <button className="text-action" onClick={() => onNavigate("Agenda")}>
              Ver agenda <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="appointment-list">
            {active.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No hay turnos para hoy"
                text="Tu agenda está libre."
              />
            ) : (
              active.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appointment={a}
                  patient={patientById(patients, a.patientId)}
                  onPatient={onPatient}
                  onStatus={onAppointment}
                  onStart={onStart}
                />
              ))
            )}
          </div>
        </section>
        <div className="right-column">
          <section className="panel focus-panel">
            <div className="panel-heading">
              <div>
                <h2>Atención del día</h2>
                <p>Estado de tu agenda</p>
              </div>
              <Activity size={19} className="subtle-icon" />
            </div>
            <div className="progress-copy">
              <strong>
                {active.filter((a) => a.status === "Atendido").length} de {active.length}
              </strong>
              <span>turnos atendidos</span>
            </div>
            <div className="progress-track">
              <span
                style={{
                  width: `${active.length ? (active.filter((a) => a.status === "Atendido").length / active.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="focus-meta">
              <span>
                <i className="dot green-dot" /> Atendidos
              </span>
              <span>
                <i className="dot amber-dot" /> Pendientes / confirmados
              </span>
            </div>
          </section>
          <section className="panel quick-panel">
            <div className="panel-heading">
              <div>
                <h2>Accesos rápidos</h2>
                <p>Continuá con tu trabajo</p>
              </div>
            </div>
            <button className="quick-link" onClick={() => onNavigate("Pacientes")}>
              <span className="quick-icon blue-bg">
                <Users size={17} />
              </span>
              <span>
                <strong>Buscar paciente</strong>
                <small>Abrir un registro clínico</small>
              </span>
              <ChevronRight size={17} />
            </button>
            <button className="quick-link" onClick={() => onNavigate("Consultas")}>
              <span className="quick-icon violet-bg">
                <ClipboardList size={17} />
              </span>
              <span>
                <strong>Ver consultas</strong>
                <small>Borradores y evoluciones</small>
              </span>
              <ChevronRight size={17} />
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
