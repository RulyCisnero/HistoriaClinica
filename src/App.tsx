import { CalendarCheck, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, Eye, HeartPulse, LockKeyhole, Menu, MoreHorizontal, Plus, Save, ShieldCheck, X, AlertCircle, Bell } from "lucide-react";
import type { Appointment, AppointmentStatus, Consultation, Patient, Section, Specialty } from "./types";
import { initialPatients, initialAppointments, initialConsultations, rheumPatients, rheumAppointments, rheumConsultations, today } from "./data/mockData";
import { fullName, formatDate, patientById } from "./utils/formatters";
import { navItems } from "./data/navigation";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { AgendaPage } from "./pages/agenda/AgendaPage";
import { PatientsPage, PatientProfile } from "./pages/patients/PatientsPage";
import { ConsultationsPage, consultationFields, ConsultationEditor, ConsultationReadOnly } from "./pages/consultations/ConsultationsPage";
import { DocumentsPage } from "./pages/documents/DocumentsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { Modal } from "./components/shared/Modal";
import { FormField } from "./components/shared/FormField";
import { useMemo, useState } from "react";
import React from "react";

export default function App() {
  const [specialty, setSpecialty] = useState<Specialty>("Urología");
  const [section, setSection] = useState<Section>("Inicio");
  const [mobileNav, setMobileNav] = useState(false);
  const [patientsBySpecialty, setPatientsBySpecialty] = useState<Record<Specialty, Patient[]>>({ Urología: initialPatients, Reumatología: rheumPatients });
  const [appointmentsBySpecialty, setAppointmentsBySpecialty] = useState<Record<Specialty, Appointment[]>>({ Urología: initialAppointments, Reumatología: rheumAppointments });
  const [consultationsBySpecialty, setConsultationsBySpecialty] = useState<Record<Specialty, Consultation[]>>({ Urología: initialConsultations, Reumatología: rheumConsultations });
  const patients = patientsBySpecialty[specialty];
  const appointments = appointmentsBySpecialty[specialty];
  const consultations = consultationsBySpecialty[specialty];
  const setPatients = (update: Patient[] | ((current: Patient[]) => Patient[])) => setPatientsBySpecialty(current => ({ ...current, [specialty]: typeof update === "function" ? update(current[specialty]) : update }));
  const setAppointments = (update: Appointment[] | ((current: Appointment[]) => Appointment[])) => setAppointmentsBySpecialty(current => ({ ...current, [specialty]: typeof update === "function" ? update(current[specialty]) : update }));
  const setConsultations = (update: Consultation[] | ((current: Consultation[]) => Consultation[])) => setConsultationsBySpecialty(current => ({ ...current, [specialty]: typeof update === "function" ? update(current[specialty]) : update }));
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [patientTab, setPatientTab] = useState<"Resumen" | "Historia clínica" | "Antecedentes" | "Documentos">("Resumen");
  const [search, setSearch] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [preview, setPreview] = useState(false);
  const [rectify, setRectify] = useState<Consultation | null>(null);
  const [toast, setToast] = useState("");
  const [agendaView, setAgendaView] = useState<"Día" | "Semana" | "Mes">("Día");
  const [agendaDate, setAgendaDate] = useState(today);
  const [patientDraft, setPatientDraft] = useState({ dni: "", firstName: "", lastName: "", birth: "", phone: "", email: "", insuranceProvider: "", insurancePlan: "", memberNumber: "" });
  const [appointmentDraft, setAppointmentDraft] = useState({ patientId: "1", date: today, time: "13:00", reason: "" });
  const [documentSearch, setDocumentSearch] = useState("");

  const doctor = specialty === "Urología"
    ? { name: "Dr. Martín López", role: "Especialista en Urología", initials: "ML", color: "blue" }
    : { name: "Dra. Laura Méndez", role: "Especialista en Reumatología", initials: "LM", color: "violet" };
  const visiblePatients = useMemo(() => patients.filter(p =>
    `${p.dni} ${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  ), [patients, search]);
  const visibleAppointments = appointments.filter(a => a.date === agendaDate && a.status !== "Cancelado").sort((a, b) => a.time.localeCompare(b.time));
  const selected = selectedPatient ? patients.find(p => p.id === selectedPatient) : null;
  const todayAppointments = appointments.filter(a => a.date === today && a.status !== "Cancelado");
  const pending = todayAppointments.filter(a => a.status === "Pendiente").length;
  const drafts = consultations.filter(c => c.status === "Borrador").length;

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const go = (target: Section) => { setSection(target); setSelectedPatient(null); setMobileNav(false); };
  const updateAppointment = (id: number, status: AppointmentStatus) => {
    setAppointments(items => items.map(a => a.id === id ? { ...a, status } : a));
    notify(`Turno actualizado: ${status.toLowerCase()}.`);
  };
  const openConsultation = (patientId: number, appointmentId?: number) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) { notify("No se encontró el paciente seleccionado."); return; }
    const existing = consultations.find(c => c.patientId === patientId && c.status === "Borrador");
    setActiveConsultation(existing ?? {
      id: Date.now(), patientId, date: today, time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      type: consultations.some(c => c.patientId === patientId && c.status === "Finalizada") ? "Seguimiento" : "Primera consulta",
      status: "Borrador", reason: "", symptoms: "", exam: "", studies: "", diagnosis: "", plan: "", notes: "",
      coverage: patient.insuranceCoverages?.find(c => c.status === "Activa") ?? null,
    });
    setShowConsultation(true); setPreview(false);
    if (appointmentId) setAppointments(items => items.map(a => a.id === appointmentId ? { ...a, status: "Atendido" } : a));
  };
  const saveDraft = () => {
    if (!activeConsultation) return;
    setConsultations(items => [...items.filter(c => c.id !== activeConsultation.id), { ...activeConsultation, status: "Borrador" }]);
    setShowConsultation(false); setActiveConsultation(null); notify("Borrador guardado correctamente.");
  };
  const finalizeConsultation = () => {
    if (!activeConsultation) return;
    setConsultations(items => [...items.filter(c => c.id !== activeConsultation.id), { ...activeConsultation, status: "Finalizada" }]);
    setShowConsultation(false); setPreview(false); setActiveConsultation(null); notify("Evolución finalizada y bloqueada para edición.");
  };
  const addPatient = () => {
    if (!patientDraft.dni || !patientDraft.firstName || !patientDraft.lastName || !patientDraft.birth) return;
    if (patients.some(p => p.dni === patientDraft.dni)) { notify("Ya existe un paciente con ese DNI en este registro."); return; }
    const { insuranceProvider, insurancePlan, memberNumber, ...patientData } = patientDraft;
    const coverage = insuranceProvider.trim() && memberNumber.trim()
      ? [{ id: Date.now(), provider: insuranceProvider.trim(), plan: insurancePlan.trim() || "Sin plan informado", memberNumber: memberNumber.trim(), status: "Activa" as const }]
      : [];
    const created: Patient = { id: Date.now(), ...patientData, insuranceCoverages: coverage, lastVisit: "—", status: "Nuevo", personal: "Sin antecedentes cargados.", family: "Sin antecedentes cargados.", allergies: "Sin datos cargados.", medication: "Sin datos cargados." };
    setPatients(items => [created, ...items]); setShowPatientForm(false); setPatientDraft({ dni: "", firstName: "", lastName: "", birth: "", phone: "", email: "", insuranceProvider: "", insurancePlan: "", memberNumber: "" });
    setSelectedPatient(created.id); setPatientTab("Resumen"); notify("Paciente agregado al registro de esta especialidad.");
  };
  const addAppointment = () => {
    const patientId = Number(appointmentDraft.patientId);
    if (!patientId || !appointmentDraft.date || !appointmentDraft.time) return;
    if (appointments.some(a => a.date === appointmentDraft.date && a.time === appointmentDraft.time && a.status !== "Cancelado")) { notify("Ese horario ya tiene un turno asignado."); return; }
    setAppointments(items => [...items, { id: Date.now(), patientId, date: appointmentDraft.date, time: appointmentDraft.time, reason: appointmentDraft.reason, status: "Pendiente" }]);
    setShowAppointmentForm(false); notify("Turno creado en estado Pendiente.");
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><HeartPulse size={22} /></div><div><strong>clínica</strong><span>HISTORIA DIGITAL</span></div><button className="icon-button mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></button></div>
      <div className="workspace-label">CONSULTORIO</div>
      <button className="doctor-switch" onClick={() => setSpecialty(s => s === "Urología" ? "Reumatología" : "Urología")}>
        <div className={`avatar small ${specialty === "Urología" ? "blue" : "violet"}`}>{doctor.initials}</div>
        <div className="doctor-copy"><strong>{doctor.name}</strong><span>{doctor.role}</span></div><ChevronDown size={16} />
      </button>
      <div className="workspace-label nav-label">MENÚ PRINCIPAL</div>
      <nav className="main-nav">{navItems.map(item => <button key={item.label} className={section === item.label ? "nav-item active" : "nav-item"} onClick={() => go(item.label)}><item.icon size={18} /><span>{item.label}</span>{item.label === "Consultas" && drafts > 0 && <em>{drafts}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="privacy-note"><ShieldCheck size={17} /><div><strong>Entorno privado</strong><span>Acceso profesional</span></div></div><button className="profile-button"><div className="avatar tiny">{doctor.initials}</div><div><strong>{doctor.name}</strong><span>Mi perfil</span></div><MoreHorizontal size={18} /></button></div>
    </aside>
    {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><span className="breadcrumb">Consultorio <ChevronRight size={14} /> <strong>{section}</strong></span></div><div className="topbar-right"><span className="today-label"><CalendarDays size={15} /> Martes, 24 de noviembre de 2026</span><button className="icon-button notification" onClick={() => notify("No tenés notificaciones nuevas.")}><Bell size={18} /><i /></button><div className="avatar tiny">{doctor.initials}</div></div></header>
      <div className="page-content">
        {selected ? <PatientProfile patient={selected} consultations={consultations.filter(c => c.patientId === selected.id)} tab={patientTab} setTab={setPatientTab} onBack={() => setSelectedPatient(null)} onConsult={() => openConsultation(selected.id)} onRectify={setRectify} /> :
          section === "Inicio" ? <DashboardPage doctor={doctor} appointments={todayAppointments} patients={patients} pending={pending} drafts={drafts} onNavigate={go} onPatient={setSelectedPatient} onAppointment={updateAppointment} onStart={openConsultation} /> :
            section === "Agenda" ? <AgendaPage appointments={visibleAppointments} patients={patients} date={agendaDate} setDate={setAgendaDate} view={agendaView} setView={setAgendaView} onNew={() => setShowAppointmentForm(true)} onPatient={setSelectedPatient} onStatus={updateAppointment} onStart={openConsultation} /> :
              section === "Pacientes" ? <PatientsPage patients={visiblePatients} search={search} setSearch={setSearch} onNew={() => setShowPatientForm(true)} onOpen={setSelectedPatient} /> :
                section === "Consultas" ? <ConsultationsPage consultations={consultations} patients={patients} onOpen={c => { setActiveConsultation(c); setShowConsultation(true); }} onRectify={setRectify} /> :
                  section === "Documentos" ? <DocumentsPage patients={patients} search={documentSearch} setSearch={setDocumentSearch} /> :
                    <SettingsPage doctor={doctor} specialty={specialty} onSwitch={() => setSpecialty(s => s === "Urología" ? "Reumatología" : "Urología")} />}
      </div>
      <footer className="footer"><span>Clínica · Demo interactiva</span><span><LockKeyhole size={12} /> Datos ficticios · No utilizar para atención real</span></footer>
    </main>

    {showPatientForm && <Modal title="Nuevo paciente" subtitle="El registro quedará asociado a tu especialidad." onClose={() => setShowPatientForm(false)}>
      <div className="form-grid">
        <FormField label="DNI *"><input value={patientDraft.dni} onChange={e => setPatientDraft({ ...patientDraft, dni: e.target.value })} placeholder="Ej. 30123456" /></FormField>
        <FormField label="Fecha de nacimiento *"><input type="date" value={patientDraft.birth} onChange={e => setPatientDraft({ ...patientDraft, birth: e.target.value })} /></FormField>
        <FormField label="Nombre *"><input value={patientDraft.firstName} onChange={e => setPatientDraft({ ...patientDraft, firstName: e.target.value })} placeholder="Nombre" /></FormField>
        <FormField label="Apellido *"><input value={patientDraft.lastName} onChange={e => setPatientDraft({ ...patientDraft, lastName: e.target.value })} placeholder="Apellido" /></FormField>
        <FormField label="Teléfono"><input value={patientDraft.phone} onChange={e => setPatientDraft({ ...patientDraft, phone: e.target.value })} placeholder="291 ..." /></FormField>
        <FormField label="Email"><input value={patientDraft.email} onChange={e => setPatientDraft({ ...patientDraft, email: e.target.value })} placeholder="correo@ejemplo.com" /></FormField>
        <div className="form-section-title">Obra social / prepaga (opcional)</div>
        <FormField label="Obra social o prepaga"><input value={patientDraft.insuranceProvider} onChange={e => setPatientDraft({ ...patientDraft, insuranceProvider: e.target.value })} placeholder="Ej. OSDE, IOMA, Swiss Medical" /></FormField>
        <FormField label="Plan"><input value={patientDraft.insurancePlan} onChange={e => setPatientDraft({ ...patientDraft, insurancePlan: e.target.value })} placeholder="Nombre o código del plan" /></FormField>
        <FormField label="Número de asociado"><input value={patientDraft.memberNumber} onChange={e => setPatientDraft({ ...patientDraft, memberNumber: e.target.value })} placeholder="Número de afiliado" /></FormField>
        <p className="form-hint">Si no tiene cobertura, dejá estos campos vacíos. Para cargar cobertura, completá obra social/prepaga y número de asociado.</p>
      </div><div className="modal-actions"><button className="btn secondary" onClick={() => setShowPatientForm(false)}>Cancelar</button><button className="btn primary" onClick={addPatient}><Plus size={16} /> Crear paciente</button></div>
    </Modal>}
    {showAppointmentForm && <Modal title="Nuevo turno" subtitle="Los turnos nuevos comienzan en estado Pendiente." onClose={() => setShowAppointmentForm(false)}>
      <div className="form-stack"><FormField label="Paciente"><select value={appointmentDraft.patientId} onChange={e => setAppointmentDraft({ ...appointmentDraft, patientId: e.target.value })}>{patients.map(p => <option key={p.id} value={p.id}>{fullName(p)} · {p.dni}</option>)}</select></FormField><div className="form-grid"><FormField label="Fecha"><input type="date" value={appointmentDraft.date} onChange={e => setAppointmentDraft({ ...appointmentDraft, date: e.target.value })} /></FormField><FormField label="Horario"><input type="time" value={appointmentDraft.time} onChange={e => setAppointmentDraft({ ...appointmentDraft, time: e.target.value })} /></FormField></div><FormField label="Motivo (opcional)"><input value={appointmentDraft.reason} onChange={e => setAppointmentDraft({ ...appointmentDraft, reason: e.target.value })} placeholder="Motivo del turno" /></FormField></div><div className="modal-actions"><button className="btn secondary" onClick={() => setShowAppointmentForm(false)}>Cancelar</button><button className="btn primary" onClick={addAppointment}><CalendarCheck size={16} /> Guardar turno</button></div>
    </Modal>}
    {showConsultation && activeConsultation && <Modal wide title={activeConsultation.status === "Finalizada" ? "Evolución clínica" : "Consulta clínica"} subtitle={`${fullName(patientById(patients, activeConsultation.patientId))} · ${doctor.name}`} onClose={() => { setShowConsultation(false); setPreview(false); }}>
      {activeConsultation.status === "Finalizada" ? <ConsultationReadOnly consultation={activeConsultation} /> : preview ? <div className="preview-document"><div className="preview-head"><div className="brand-mark"><HeartPulse size={20} /></div><div><strong>Historia clínica</strong><span>{doctor.name} · {specialty}</span></div><span className="status-pill draft">Vista previa</span></div><h3>{fullName(patientById(patients, activeConsultation.patientId))}</h3><p className="muted">{formatDate(activeConsultation.date)} · {activeConsultation.type}</p><div className="preview-row"><strong>Obra social / prepaga</strong><p>{activeConsultation.coverage ? `${activeConsultation.coverage.provider} · ${activeConsultation.coverage.plan} · Asociado ${activeConsultation.coverage.memberNumber}` : "Particular / sin cobertura"}</p></div>{consultationFields.map(([key, label]) => <div className="preview-row" key={key}><strong>{label}</strong><p>{activeConsultation[key as keyof Consultation] as string || "Sin completar"}</p></div>)}</div> :
        <ConsultationEditor value={activeConsultation} onChange={setActiveConsultation} specialty={specialty} patient={patientById(patients, activeConsultation.patientId)} />}
      <div className="modal-actions">{activeConsultation.status === "Finalizada" ? <button className="btn secondary" onClick={() => setShowConsultation(false)}>Cerrar</button> : preview ? <><button className="btn secondary" onClick={() => setPreview(false)}>Volver a editar</button><button className="btn primary" onClick={finalizeConsultation}><CheckCircle2 size={16} /> Confirmar y finalizar</button></> : <><button className="btn secondary" onClick={saveDraft}><Save size={16} /> Guardar borrador</button><button className="btn primary" onClick={() => setPreview(true)}><Eye size={16} /> Vista previa</button></>}</div>
    </Modal>}
    {rectify && <Modal title="Rectificar evolución" subtitle="La evolución original se conservará sin modificaciones." onClose={() => setRectify(null)}><div className="notice warning"><AlertCircle size={17} /> La rectificación quedará vinculada al documento original.</div><FormField label="Motivo de la rectificación"><textarea id="rectification" rows={4} placeholder="Describí el motivo y el contenido que debe aclararse o corregirse." /></FormField><div className="modal-actions"><button className="btn secondary" onClick={() => setRectify(null)}>Cancelar</button><button className="btn primary" onClick={() => { const value = (document.getElementById("rectification") as HTMLTextAreaElement)?.value.trim(); if (!value) { notify("Ingresá el motivo y contenido de la rectificación."); return; } setConsultations(items => [...items, { ...rectify, id: Date.now(), status: "Finalizada", rectification: value }]); setRectify(null); notify("Rectificación agregada al historial."); }}><Check size={16} /> Registrar rectificación</button></div></Modal>}
    {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
  </div>;
}
