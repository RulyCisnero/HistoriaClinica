export type Specialty = "Urología" | "Reumatología";
export type Section = "Inicio" | "Agenda" | "Pacientes" | "Consultas" | "Documentos" | "Configuración";
export type Patient = { id:number; dni:string; firstName:string; lastName:string; birth:string; phone:string; email:string; lastVisit:string; status:string; personal:string; family:string; allergies:string; medication:string };
export type AppointmentStatus = "Pendiente" | "Confirmado" | "Atendido" | "Cancelado" | "Ausente";
export type Appointment = { id:number; patientId:number; date:string; time:string; reason:string; status:AppointmentStatus };
export type Consultation = { id:number; patientId:number; date:string; time:string; type:"Primera consulta"|"Seguimiento"; status:"Borrador"|"Finalizada"; reason:string; symptoms:string; exam:string; studies:string; diagnosis:string; plan:string; notes:string; rectification?:string };
export type Doctor = { name:string; role:string; initials:string; color:string };
