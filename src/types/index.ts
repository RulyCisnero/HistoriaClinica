export type Specialty = "Urología" | "Reumatología";
export type Section =
  "Inicio" | "Agenda" | "Pacientes" | "Consultas" | "Documentos" | "Configuración";
export type InsuranceCoverage = {
  id: number;
  provider: string;
  plan: string;
  memberNumber: string;
  status: "Activa" | "Inactiva";
};
export type Patient = {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  birth: string;
  phone: string;
  email: string;
  lastVisit: string;
  status: string;
  personal: string;
  family: string;
  allergies: string;
  medication: string;
  insuranceCoverages?: InsuranceCoverage[];
};
export type AppointmentStatus = "Pendiente" | "Confirmado" | "Atendido" | "Cancelado" | "Ausente";
export type Appointment = {
  id: number;
  patientId: number;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
};
export type Consultation = {
  id: number;
  patientId: number;
  date: string;
  time: string;
  type: "Primera consulta" | "Seguimiento";
  status: "Borrador" | "Finalizada";
  reason: string;
  symptoms: string;
  exam: string;
  studies: string;
  diagnosis: string;
  plan: string;
  notes: string;
  coverage?: InsuranceCoverage | null;
  rectification?: string;
};
export type Doctor = { name: string; role: string; initials: string; color: string };
