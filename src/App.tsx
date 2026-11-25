import { useMemo, useState, type ReactNode } from "react";
import {
  Activity, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  ClipboardList, Clock3, FileText, HeartPulse, LayoutDashboard, LogOut,
  Menu, MoreHorizontal, Plus, Search, Settings, ShieldCheck, Stethoscope,
  UserRound, Users, X, AlertCircle, ArrowUpRight, Paperclip, Save,
  CheckCircle2, FilePlus2, SlidersHorizontal, Bell, CalendarCheck, Filter,
  Pencil, Eye, Download, LockKeyhole
} from "lucide-react";

type Specialty = "Urología" | "Reumatología";
type Section = "Inicio" | "Agenda" | "Pacientes" | "Consultas" | "Documentos" | "Configuración";
type Patient = {
  id: number; dni: string; firstName: string; lastName: string; birth: string;
  phone: string; email: string; lastVisit: string; status: string;
  personal: string; family: string; allergies: string; medication: string;
};
type AppointmentStatus = "Pendiente" | "Confirmado" | "Atendido" | "Cancelado" | "Ausente";
type Appointment = { id:number; patientId:number; date:string; time:string; reason:string; status:AppointmentStatus };
type Consultation = {
  id:number; patientId:number; date:string; time:string; type:"Primera consulta"|"Seguimiento";
  status:"Borrador"|"Finalizada"; reason:string; symptoms:string; exam:string; studies:string;
  diagnosis:string; plan:string; notes:string; rectification?:string;
};

const initialPatients: Patient[] = [
  {id:1,dni:"28456789",firstName:"Mariana",lastName:"Gómez",birth:"1982-04-18",phone:"291 456-7821",email:"mariana.gomez@email.com",lastVisit:"18 nov 2026",status:"En seguimiento",personal:"Hipertensión arterial controlada.",family:"Madre con diabetes tipo 2.",allergies:"Penicilina.",medication:"Losartán 50 mg."},
  {id:2,dni:"32145987",firstName:"Carlos",lastName:"Fernández",birth:"1976-09-02",phone:"291 512-3344",email:"c.fernandez@email.com",lastVisit:"20 nov 2026",status:"Activo",personal:"Sin antecedentes relevantes.",family:"Padre con antecedente cardiovascular.",allergies:"Niega.",medication:"No refiere."},
  {id:3,dni:"25789123",firstName:"Lucía",lastName:"Martínez",birth:"1990-12-11",phone:"291 401-9876",email:"lucia.m@email.com",lastVisit:"12 nov 2026",status:"En seguimiento",personal:"Hipotiroidismo.",family:"Madre con artritis reumatoidea.",allergies:"Niega.",medication:"Levotiroxina 75 mcg."},
  {id:4,dni:"30112654",firstName:"Jorge",lastName:"Pérez",birth:"1985-06-27",phone:"291 620-1188",email:"jorge.perez@email.com",lastVisit:"05 nov 2026",status:"Activo",personal:"Antecedente de cólico renal.",family:"Sin datos relevantes.",allergies:"Ibuprofeno.",medication:"No refiere."},
  {id:5,dni:"33987654",firstName:"Valeria",lastName:"Suárez",birth:"1992-02-08",phone:"291 555-0943",email:"valeria.s@email.com",lastVisit:"—",status:"Nuevo",personal:"Sin antecedentes cargados.",family:"Sin antecedentes cargados.",allergies:"Sin datos cargados.",medication:"Sin datos cargados."},
];

const today = "2026-11-24";
const initialAppointments: Appointment[] = [
  {id:1,patientId:1,date:today,time:"08:30",reason:"Control de seguimiento",status:"Confirmado"},
  {id:2,patientId:2,date:today,time:"09:00",reason:"Consulta por síntomas",status:"Pendiente"},
  {id:3,patientId:3,date:today,time:"09:30",reason:"Control periódico",status:"Confirmado"},
  {id:4,patientId:4,date:today,time:"10:30",reason:"Revisión de estudios",status:"Pendiente"},
  {id:5,patientId:5,date:today,time:"11:00",reason:"Primera consulta",status:"Pendiente"},
  {id:6,patientId:2,date:today,time:"12:00",reason:"Seguimiento",status:"Atendido"},
];

const initialConsultations: Consultation[] = [
  {id:101,patientId:1,date:"2026-11-18",time:"09:20",type:"Seguimiento",status:"Finalizada",reason:"Control evolutivo",symptoms:"Refiere mejoría de la sintomatología inicial.",exam:"Examen sin cambios relevantes.",studies:"Laboratorio de control revisado.",diagnosis:"Evolución favorable.",plan:"Continuar tratamiento actual. Nuevo control en 30 días.",notes:"Se explican pautas de alarma."},
  {id:102,patientId:2,date:"2026-11-20",time:"10:10",type:"Primera consulta",status:"Finalizada",reason:"Molestias persistentes",symptoms:"Síntomas de evolución reciente.",exam:"Pendiente completar examen dirigido.",studies:"No presenta estudios.",diagnosis:"En evaluación.",plan:"Solicitar estudios complementarios.",notes:"Datos ficticios para demostración."},
  {id:103,patientId:3,date:"2026-11-21",time:"11:00",type:"Seguimiento",status:"Borrador",reason:"Control de seguimiento",symptoms:"Dolor articular intermitente.",exam:"",studies:"",diagnosis:"",plan:"",notes:""},
];

const rheumPatients: Patient[] = [
  {id:11,dni:"27890123",firstName:"Andrea",lastName:"Luna",birth:"1981-03-14",phone:"291 430-2281",email:"andrea.luna@email.com",lastVisit:"19 nov 2026",status:"En seguimiento",personal:"Artritis reumatoidea en seguimiento.",family:"Madre con enfermedad autoinmune.",allergies:"Niega.",medication:"Metotrexato según indicación."},
  {id:12,dni:"30987654",firstName:"Pablo",lastName:"Ríos",birth:"1987-07-22",phone:"291 522-9011",email:"p.rios@email.com",lastVisit:"21 nov 2026",status:"Activo",personal:"Lumbalgia episódica.",family:"Sin datos relevantes.",allergies:"Niega.",medication:"No refiere."},
  {id:13,dni:"25123456",firstName:"Sofía",lastName:"Acosta",birth:"1978-11-09",phone:"291 611-4820",email:"sofia.acosta@email.com",lastVisit:"—",status:"Nuevo",personal:"Sin antecedentes cargados.",family:"Sin antecedentes cargados.",allergies:"Sin datos cargados.",medication:"Sin datos cargados."},
  {id:14,dni:"33456789",firstName:"Diego",lastName:"Molina",birth:"1991-01-30",phone:"291 477-0123",email:"d.molina@email.com",lastVisit:"14 nov 2026",status:"En seguimiento",personal:"Dolor articular en evaluación.",family:"Padre con psoriasis.",allergies:"No refiere.",medication:"No refiere."},
];
const rheumAppointments: Appointment[] = [
  {id:11,patientId:11,date:today,time:"08:30",reason:"Control de tratamiento",status:"Confirmado"},
  {id:12,patientId:12,date:today,time:"09:30",reason:"Dolor lumbar",status:"Pendiente"},
  {id:13,patientId:13,date:today,time:"10:30",reason:"Primera consulta",status:"Pendiente"},
  {id:14,patientId:14,date:today,time:"11:30",reason:"Control evolutivo",status:"Confirmado"},
];
const rheumConsultations: Consultation[] = [
  {id:111,patientId:11,date:"2026-11-19",time:"09:10",type:"Seguimiento",status:"Finalizada",reason:"Control de tratamiento",symptoms:"Menor rigidez matinal según refiere.",exam:"Examen articular registrado.",studies:"Laboratorio de seguimiento revisado.",diagnosis:"Enfermedad en seguimiento.",plan:"Mantener plan actual y control evolutivo.",notes:"Datos ficticios de demostración."},
  {id:112,patientId:14,date:"2026-11-14",time:"10:40",type:"Seguimiento",status:"Borrador",reason:"Control evolutivo",symptoms:"Dolor articular intermitente.",exam:"",studies:"",diagnosis:"",plan:"",notes:""},
];

const nav: {label:Section; icon:typeof LayoutDashboard}[] = [
  {label:"Inicio",icon:LayoutDashboard},{label:"Agenda",icon:CalendarDays},{label:"Pacientes",icon:Users},
  {label:"Consultas",icon:ClipboardList},{label:"Documentos",icon:FileText},{label:"Configuración",icon:Settings},
];
const initials = (p:Patient) => `${p.firstName[0]}${p.lastName[0]}`;
const fullName = (p:Patient) => `${p.firstName} ${p.lastName}`;
const formatDate = (value:string) => new Date(value+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"});
const patientById = (patients:Patient[], id:number) => patients.find(p=>p.id===id)!;

export default function App() {
  const [specialty,setSpecialty] = useState<Specialty>("Urología");
  const [section,setSection] = useState<Section>("Inicio");
  const [mobileNav,setMobileNav] = useState(false);
  const [patientsBySpecialty,setPatientsBySpecialty] = useState<Record<Specialty,Patient[]>>({Urología:initialPatients,Reumatología:rheumPatients});
  const [appointmentsBySpecialty,setAppointmentsBySpecialty] = useState<Record<Specialty,Appointment[]>>({Urología:initialAppointments,Reumatología:rheumAppointments});
  const [consultationsBySpecialty,setConsultationsBySpecialty] = useState<Record<Specialty,Consultation[]>>({Urología:initialConsultations,Reumatología:rheumConsultations});
  const patients = patientsBySpecialty[specialty];
  const appointments = appointmentsBySpecialty[specialty];
  const consultations = consultationsBySpecialty[specialty];
  const setPatients = (update:Patient[]|((current:Patient[])=>Patient[])) => setPatientsBySpecialty(current=>({...current,[specialty]:typeof update==="function"?update(current[specialty]):update}));
  const setAppointments = (update:Appointment[]|((current:Appointment[])=>Appointment[])) => setAppointmentsBySpecialty(current=>({...current,[specialty]:typeof update==="function"?update(current[specialty]):update}));
  const setConsultations = (update:Consultation[]|((current:Consultation[])=>Consultation[])) => setConsultationsBySpecialty(current=>({...current,[specialty]:typeof update==="function"?update(current[specialty]):update}));
  const [selectedPatient,setSelectedPatient] = useState<number|null>(null);
  const [patientTab,setPatientTab] = useState<"Resumen"|"Historia clínica"|"Antecedentes"|"Documentos">("Resumen");
  const [search,setSearch] = useState("");
  const [showPatientForm,setShowPatientForm] = useState(false);
  const [showAppointmentForm,setShowAppointmentForm] = useState(false);
  const [showConsultation,setShowConsultation] = useState(false);
  const [activeConsultation,setActiveConsultation] = useState<Consultation|null>(null);
  const [preview,setPreview] = useState(false);
  const [rectify,setRectify] = useState<Consultation|null>(null);
  const [toast,setToast] = useState("");
  const [agendaView,setAgendaView] = useState<"Día"|"Semana"|"Mes">("Día");
  const [agendaDate,setAgendaDate] = useState(today);
  const [patientDraft,setPatientDraft] = useState({dni:"",firstName:"",lastName:"",birth:"",phone:"",email:""});
  const [appointmentDraft,setAppointmentDraft] = useState({patientId:"1",date:today,time:"13:00",reason:""});
  const [documentSearch,setDocumentSearch] = useState("");

  const doctor = specialty==="Urología"
    ? {name:"Dr. Martín López",role:"Especialista en Urología",initials:"ML",color:"blue"}
    : {name:"Dra. Laura Méndez",role:"Especialista en Reumatología",initials:"LM",color:"violet"};
  const visiblePatients = useMemo(()=>patients.filter(p=>
    `${p.dni} ${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  ),[patients,search]);
  const visibleAppointments = appointments.filter(a=>a.date===agendaDate && a.status!=="Cancelado").sort((a,b)=>a.time.localeCompare(b.time));
  const selected = selectedPatient ? patients.find(p=>p.id===selectedPatient) : null;
  const todayAppointments = appointments.filter(a=>a.date===today && a.status!=="Cancelado");
  const pending = todayAppointments.filter(a=>a.status==="Pendiente").length;
  const drafts = consultations.filter(c=>c.status==="Borrador").length;

  const notify = (message:string) => { setToast(message); window.setTimeout(()=>setToast(""),2600); };
  const go = (target:Section) => {setSection(target);setSelectedPatient(null);setMobileNav(false);};
  const updateAppointment = (id:number,status:AppointmentStatus) => {
    setAppointments(items=>items.map(a=>a.id===id?{...a,status}:a));
    notify(`Turno actualizado: ${status.toLowerCase()}.`);
  };
  const openConsultation = (patientId:number, appointmentId?:number) => {
    const existing = consultations.find(c=>c.patientId===patientId && c.status==="Borrador");
    setActiveConsultation(existing ?? {
      id:Date.now(),patientId,date:today,time:new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),
      type:consultations.some(c=>c.patientId===patientId && c.status==="Finalizada")?"Seguimiento":"Primera consulta",
      status:"Borrador",reason:"",symptoms:"",exam:"",studies:"",diagnosis:"",plan:"",notes:"",
    });
    setShowConsultation(true);setPreview(false);
    if(appointmentId) setAppointments(items=>items.map(a=>a.id===appointmentId?{...a,status:"Atendido"}:a));
  };
  const saveDraft = () => {
    if(!activeConsultation) return;
    setConsultations(items=>[...items.filter(c=>c.id!==activeConsultation.id),{...activeConsultation,status:"Borrador"}]);
    setShowConsultation(false);setActiveConsultation(null);notify("Borrador guardado correctamente.");
  };
  const finalizeConsultation = () => {
    if(!activeConsultation) return;
    setConsultations(items=>[...items.filter(c=>c.id!==activeConsultation.id),{...activeConsultation,status:"Finalizada"}]);
    setShowConsultation(false);setPreview(false);setActiveConsultation(null);notify("Evolución finalizada y bloqueada para edición.");
  };
  const addPatient = () => {
    if(!patientDraft.dni || !patientDraft.firstName || !patientDraft.lastName || !patientDraft.birth) return;
    if(patients.some(p=>p.dni===patientDraft.dni)){notify("Ya existe un paciente con ese DNI en este registro.");return;}
    const created:Patient={id:Date.now(),...patientDraft,lastVisit:"—",status:"Nuevo",personal:"Sin antecedentes cargados.",family:"Sin antecedentes cargados.",allergies:"Sin datos cargados.",medication:"Sin datos cargados."};
    setPatients(items=>[created,...items]);setShowPatientForm(false);setPatientDraft({dni:"",firstName:"",lastName:"",birth:"",phone:"",email:""});
    setSelectedPatient(created.id);setPatientTab("Resumen");notify("Paciente agregado al registro de esta especialidad.");
  };
  const addAppointment = () => {
    const patientId=Number(appointmentDraft.patientId);
    if(!patientId || !appointmentDraft.date || !appointmentDraft.time) return;
    if(appointments.some(a=>a.date===appointmentDraft.date && a.time===appointmentDraft.time && a.status!=="Cancelado")){notify("Ese horario ya tiene un turno asignado.");return;}
    setAppointments(items=>[...items,{id:Date.now(),patientId,date:appointmentDraft.date,time:appointmentDraft.time,reason:appointmentDraft.reason,status:"Pendiente"}]);
    setShowAppointmentForm(false);notify("Turno creado en estado Pendiente.");
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"sidebar-open":""}`}>
      <div className="brand"><div className="brand-mark"><HeartPulse size={22}/></div><div><strong>clínica</strong><span>HISTORIA DIGITAL</span></div><button className="icon-button mobile-close" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">CONSULTORIO</div>
      <button className="doctor-switch" onClick={()=>setSpecialty(s=>s==="Urología"?"Reumatología":"Urología")}>
        <div className={`avatar small ${specialty==="Urología"?"blue":"violet"}`}>{doctor.initials}</div>
        <div className="doctor-copy"><strong>{doctor.name}</strong><span>{doctor.role}</span></div><ChevronDown size={16}/>
      </button>
      <div className="workspace-label nav-label">MENÚ PRINCIPAL</div>
      <nav className="main-nav">{nav.map(item=><button key={item.label} className={section===item.label?"nav-item active":"nav-item"} onClick={()=>go(item.label)}><item.icon size={18}/><span>{item.label}</span>{item.label==="Consultas"&&drafts>0&&<em>{drafts}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="privacy-note"><ShieldCheck size={17}/><div><strong>Entorno privado</strong><span>Acceso profesional</span></div></div><button className="profile-button"><div className="avatar tiny">{doctor.initials}</div><div><strong>{doctor.name}</strong><span>Mi perfil</span></div><MoreHorizontal size={18}/></button></div>
    </aside>
    {mobileNav&&<div className="scrim" onClick={()=>setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={()=>setMobileNav(true)}><Menu size={20}/></button><span className="breadcrumb">Consultorio <ChevronRight size={14}/> <strong>{section}</strong></span></div><div className="topbar-right"><span className="today-label"><CalendarDays size={15}/> Martes, 24 de noviembre de 2026</span><button className="icon-button notification" onClick={()=>notify("No tenés notificaciones nuevas.")}><Bell size={18}/><i/></button><div className="avatar tiny">{doctor.initials}</div></div></header>
      <div className="page-content">
        {selected ? <PatientProfile patient={selected} consultations={consultations.filter(c=>c.patientId===selected.id)} tab={patientTab} setTab={setPatientTab} onBack={()=>setSelectedPatient(null)} onConsult={()=>notify("La creación de consultas sin turno sigue pendiente de definición funcional.")} onRectify={setRectify}/> :
        section==="Inicio" ? <Dashboard doctor={doctor} appointments={todayAppointments} patients={patients} pending={pending} drafts={drafts} onNavigate={go} onPatient={setSelectedPatient} onAppointment={updateAppointment} onStart={openConsultation}/> :
        section==="Agenda" ? <Agenda appointments={visibleAppointments} patients={patients} date={agendaDate} setDate={setAgendaDate} view={agendaView} setView={setAgendaView} onNew={()=>setShowAppointmentForm(true)} onPatient={setSelectedPatient} onStatus={updateAppointment} onStart={openConsultation}/> :
        section==="Pacientes" ? <Patients patients={visiblePatients} search={search} setSearch={setSearch} onNew={()=>setShowPatientForm(true)} onOpen={setSelectedPatient}/> :
        section==="Consultas" ? <Consultations consultations={consultations} patients={patients} onOpen={c=>{setActiveConsultation(c);setShowConsultation(true);}} onRectify={setRectify}/> :
        section==="Documentos" ? <Documents patients={patients} search={documentSearch} setSearch={setDocumentSearch}/> :
        <SettingsPage doctor={doctor} specialty={specialty} onSwitch={()=>setSpecialty(s=>s==="Urología"?"Reumatología":"Urología")}/>}
      </div>
      <footer className="footer"><span>Clínica · Demo interactiva</span><span><LockKeyhole size={12}/> Datos ficticios · No utilizar para atención real</span></footer>
    </main>

    {showPatientForm&&<Modal title="Nuevo paciente" subtitle="El registro quedará asociado a tu especialidad." onClose={()=>setShowPatientForm(false)}>
      <div className="form-grid">
        <Field label="DNI *"><input value={patientDraft.dni} onChange={e=>setPatientDraft({...patientDraft,dni:e.target.value})} placeholder="Ej. 30123456"/></Field>
        <Field label="Fecha de nacimiento *"><input type="date" value={patientDraft.birth} onChange={e=>setPatientDraft({...patientDraft,birth:e.target.value})}/></Field>
        <Field label="Nombre *"><input value={patientDraft.firstName} onChange={e=>setPatientDraft({...patientDraft,firstName:e.target.value})} placeholder="Nombre"/></Field>
        <Field label="Apellido *"><input value={patientDraft.lastName} onChange={e=>setPatientDraft({...patientDraft,lastName:e.target.value})} placeholder="Apellido"/></Field>
        <Field label="Teléfono"><input value={patientDraft.phone} onChange={e=>setPatientDraft({...patientDraft,phone:e.target.value})} placeholder="291 ..."/></Field>
        <Field label="Email"><input value={patientDraft.email} onChange={e=>setPatientDraft({...patientDraft,email:e.target.value})} placeholder="correo@ejemplo.com"/></Field>
      </div><div className="modal-actions"><button className="btn secondary" onClick={()=>setShowPatientForm(false)}>Cancelar</button><button className="btn primary" onClick={addPatient}><Plus size={16}/> Crear paciente</button></div>
    </Modal>}
    {showAppointmentForm&&<Modal title="Nuevo turno" subtitle="Los turnos nuevos comienzan en estado Pendiente." onClose={()=>setShowAppointmentForm(false)}>
      <div className="form-stack"><Field label="Paciente"><select value={appointmentDraft.patientId} onChange={e=>setAppointmentDraft({...appointmentDraft,patientId:e.target.value})}>{patients.map(p=><option key={p.id} value={p.id}>{fullName(p)} · {p.dni}</option>)}</select></Field><div className="form-grid"><Field label="Fecha"><input type="date" value={appointmentDraft.date} onChange={e=>setAppointmentDraft({...appointmentDraft,date:e.target.value})}/></Field><Field label="Horario"><input type="time" value={appointmentDraft.time} onChange={e=>setAppointmentDraft({...appointmentDraft,time:e.target.value})}/></Field></div><Field label="Motivo (opcional)"><input value={appointmentDraft.reason} onChange={e=>setAppointmentDraft({...appointmentDraft,reason:e.target.value})} placeholder="Motivo del turno"/></Field></div><div className="modal-actions"><button className="btn secondary" onClick={()=>setShowAppointmentForm(false)}>Cancelar</button><button className="btn primary" onClick={addAppointment}><CalendarCheck size={16}/> Guardar turno</button></div>
    </Modal>}
    {showConsultation&&activeConsultation&&<Modal wide title={activeConsultation.status==="Finalizada"?"Evolución clínica":"Consulta clínica"} subtitle={`${fullName(patientById(patients,activeConsultation.patientId))} · ${doctor.name}`} onClose={()=>{setShowConsultation(false);setPreview(false);}}>
      {activeConsultation.status==="Finalizada" ? <ConsultationReadOnly consultation={activeConsultation}/> : preview ? <div className="preview-document"><div className="preview-head"><div className="brand-mark"><HeartPulse size={20}/></div><div><strong>Historia clínica</strong><span>{doctor.name} · {specialty}</span></div><span className="status-pill draft">Vista previa</span></div><h3>{fullName(patientById(patients,activeConsultation.patientId))}</h3><p className="muted">{formatDate(activeConsultation.date)} · {activeConsultation.type}</p>{consultationFields.map(([key,label])=><div className="preview-row" key={key}><strong>{label}</strong><p>{activeConsultation[key as keyof Consultation] as string||"Sin completar"}</p></div>)}</div> :
      <ConsultationEditor value={activeConsultation} onChange={setActiveConsultation} specialty={specialty} patient={patientById(patients,activeConsultation.patientId)}/>}
      <div className="modal-actions">{activeConsultation.status==="Finalizada"?<button className="btn secondary" onClick={()=>setShowConsultation(false)}>Cerrar</button>:preview?<><button className="btn secondary" onClick={()=>setPreview(false)}>Volver a editar</button><button className="btn primary" onClick={finalizeConsultation}><CheckCircle2 size={16}/> Confirmar y finalizar</button></>:<><button className="btn secondary" onClick={saveDraft}><Save size={16}/> Guardar borrador</button><button className="btn primary" onClick={()=>setPreview(true)}><Eye size={16}/> Vista previa</button></>}</div>
    </Modal>}
    {rectify&&<Modal title="Rectificar evolución" subtitle="La evolución original se conservará sin modificaciones." onClose={()=>setRectify(null)}><div className="notice warning"><AlertCircle size={17}/> La rectificación quedará vinculada al documento original.</div><Field label="Motivo de la rectificación"><textarea id="rectification" rows={4} placeholder="Describí el motivo y el contenido que debe aclararse o corregirse."/></Field><div className="modal-actions"><button className="btn secondary" onClick={()=>setRectify(null)}>Cancelar</button><button className="btn primary" onClick={()=>{const value=(document.getElementById("rectification") as HTMLTextAreaElement)?.value.trim();if(!value){notify("Ingresá el motivo y contenido de la rectificación.");return;}setConsultations(items=>[...items,{...rectify,id:Date.now(),status:"Finalizada",rectification:value}]);setRectify(null);notify("Rectificación agregada al historial.");}}><Check size={16}/> Registrar rectificación</button></div></Modal>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

function Dashboard({doctor,appointments,patients,pending,drafts,onNavigate,onPatient,onAppointment,onStart}:{doctor:{name:string;role:string;initials:string;color:string};appointments:Appointment[];patients:Patient[];pending:number;drafts:number;onNavigate:(s:Section)=>void;onPatient:(id:number)=>void;onAppointment:(id:number,s:AppointmentStatus)=>void;onStart:(id:number,appointmentId?:number)=>void}) {
  const active=appointments.filter(a=>a.status!=="Cancelado");
  const next=active.filter(a=>a.status!=="Atendido").slice(0,4);
  return <><div className="welcome-row"><div><div className="eyebrow">MARTES, 24 DE NOVIEMBRE DE 2026</div><h1>Buen día, {doctor.name.split(" ")[1]} <span className="wave">✦</span></h1><p>Este es el resumen de tu consultorio para hoy.</p></div><button className="btn primary" onClick={()=>onNavigate("Agenda")}><CalendarDays size={16}/> Ver agenda completa</button></div>
    <div className="stats-grid"><Stat icon={CalendarCheck} label="Turnos de hoy" value={String(active.length)} note="En tu agenda" tone="blue"/><Stat icon={Clock3} label="Pendientes" value={String(pending)} note="Por confirmar" tone="amber"/><Stat icon={Users} label="Pacientes" value={String(patients.length)} note="En tu registro" tone="green"/><Stat icon={FileText} label="Borradores" value={String(drafts)} note="Consultas sin finalizar" tone="violet"/></div>
    <div className="dashboard-grid"><section className="panel agenda-panel"><div className="panel-heading"><div><h2>Agenda de hoy</h2><p>Tu actividad programada</p></div><button className="text-action" onClick={()=>onNavigate("Agenda")}>Ver agenda <ArrowUpRight size={15}/></button></div>
      <div className="appointment-list">{active.length===0?<Empty icon={CalendarDays} title="No hay turnos para hoy" text="Tu agenda está libre."/>:active.map(a=><AppointmentRow key={a.id} appointment={a} patient={patientById(patients,a.patientId)} onPatient={onPatient} onStatus={onAppointment} onStart={onStart}/>)}</div>
    </section><div className="right-column"><section className="panel focus-panel"><div className="panel-heading"><div><h2>Atención del día</h2><p>Estado de tu agenda</p></div><Activity size={19} className="subtle-icon"/></div><div className="progress-copy"><strong>{active.filter(a=>a.status==="Atendido").length} de {active.length}</strong><span>turnos atendidos</span></div><div className="progress-track"><span style={{width:`${active.length?active.filter(a=>a.status==="Atendido").length/active.length*100:0}%`}}/></div><div className="focus-meta"><span><i className="dot green-dot"/> Atendidos</span><span><i className="dot amber-dot"/> Pendientes / confirmados</span></div></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h2>Accesos rápidos</h2><p>Continuá con tu trabajo</p></div></div><button className="quick-link" onClick={()=>onNavigate("Pacientes")}><span className="quick-icon blue-bg"><Users size={17}/></span><span><strong>Buscar paciente</strong><small>Abrir un registro clínico</small></span><ChevronRight size={17}/></button><button className="quick-link" onClick={()=>onNavigate("Consultas")}><span className="quick-icon violet-bg"><ClipboardList size={17}/></span><span><strong>Ver consultas</strong><small>Borradores y evoluciones</small></span><ChevronRight size={17}/></button></section></div></div>
  </>;
}

function Stat({icon:Icon,label,value,note,tone}:{icon:typeof Users;label:string;value:string;note:string;tone:string}){return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>}

function AppointmentRow({appointment:a,patient,onPatient,onStatus,onStart}:{appointment:Appointment;patient:Patient;onPatient:(id:number)=>void;onStatus:(id:number,s:AppointmentStatus)=>void;onStart:(id:number,appointmentId?:number)=>void}) {
  return <div className="appointment-row"><div className="appointment-time"><strong>{a.time}</strong><span>{a.time==="08:30"?"30 min":"30 min"}</span></div><div className="time-line"><i/></div><div className="appointment-person"><button className="patient-name-button" onClick={()=>onPatient(patient.id)}><div className="avatar patient-avatar">{initials(patient)}</div><span><strong>{fullName(patient)}</strong><small>{a.reason||"Consulta médica"}</small></span></button></div><div className="appointment-actions"><StatusPill status={a.status}/><div className="row-menu">{a.status==="Pendiente"?<button className="mini-action" onClick={()=>onStatus(a.id,"Confirmado")}>Confirmar</button>:a.status==="Confirmado"?<button className="mini-action" onClick={()=>onStart(patient.id,a.id)}>Iniciar consulta</button>:<button className="icon-button" onClick={()=>onPatient(patient.id)}><Eye size={16}/></button>}</div></div></div>
}
function StatusPill({status}:{status:string}){const cls=status==="Confirmado"?"confirmed":status==="Pendiente"?"pending":status==="Atendido"?"attended":status==="Cancelado"?"cancelled":"absent";return <span className={`status-pill ${cls}`}><i/>{status}</span>}
function Patients({patients,search,setSearch,onNew,onOpen}:{patients:Patient[];search:string;setSearch:(s:string)=>void;onNew:()=>void;onOpen:(id:number)=>void}){return <><PageTitle eyebrow="REGISTRO CLÍNICO" title="Pacientes" description="Administrá los pacientes de tu registro profesional." action={<button className="btn primary" onClick={onNew}><Plus size={16}/> Nuevo paciente</button>}/><div className="panel table-panel"><div className="table-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por DNI, nombre o apellido..."/>{search&&<button onClick={()=>setSearch("")}><X size={15}/></button>}</div><button className="btn secondary small-btn"><Filter size={15}/> Filtros</button></div><div className="table-wrap"><table><thead><tr><th>PACIENTE</th><th>DNI</th><th>TELÉFONO</th><th>ÚLTIMA CONSULTA</th><th>ESTADO</th><th/></tr></thead><tbody>{patients.map(p=><tr key={p.id}><td><button className="table-person" onClick={()=>onOpen(p.id)}><div className="avatar patient-avatar">{initials(p)}</div><span><strong>{fullName(p)}</strong><small>{p.email||"Sin email registrado"}</small></span></button></td><td className="mono">{p.dni}</td><td>{p.phone||"—"}</td><td>{p.lastVisit}</td><td><span className={`patient-state ${p.status==="Nuevo"?"new":""}`}>{p.status}</span></td><td><button className="icon-button" onClick={()=>onOpen(p.id)}><ChevronRight size={17}/></button></td></tr>)}</tbody></table>{patients.length===0&&<Empty icon={Users} title="No encontramos pacientes" text="Probá con otro nombre o DNI."/></div><div className="table-foot"><span>Mostrando {patients.length} pacientes</span><span>Registro de {patients.length} pacientes</span></div></div></>}
function PageTitle({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:React.ReactNode}){return <div className="page-title-row"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>}
function Agenda({appointments,patients,date,setDate,view,setView,onNew,onPatient,onStatus,onStart}:{appointments:Appointment[];patients:Patient[];date:string;setDate:(s:string)=>void;view:"Día"|"Semana"|"Mes";setView:(s:"Día"|"Semana"|"Mes")=>void;onNew:()=>void;onPatient:(id:number)=>void;onStatus:(id:number,s:AppointmentStatus)=>void;onStart:(id:number,appointmentId?:number)=>void}){const shift=(n:number)=>{const d=new Date(date+"T12:00:00");d.setDate(d.getDate()+n);setDate(d.toISOString().slice(0,10));};return <><PageTitle eyebrow="ORGANIZACIÓN" title="Agenda" description="Gestioná los turnos y la disponibilidad de tu consultorio." action={<button className="btn primary" onClick={onNew}><Plus size={16}/> Nuevo turno</button>}/><div className="panel agenda-page-panel"><div className="agenda-toolbar"><div className="date-navigation"><button className="icon-button" onClick={()=>shift(view==="Mes"?-30:view==="Semana"?-7:-1)}><ChevronLeft size={18}/></button><strong>{view==="Día"?formatDate(date):new Date(date+"T12:00:00").toLocaleDateString("es-AR",{month:"long",year:"numeric"})}</strong><button className="icon-button" onClick={()=>shift(view==="Mes"?30:view==="Semana"?7:1)}><ChevronRight size={18}/></button><button className="btn secondary small-btn" onClick={()=>setDate(today)}>Hoy</button></div><div className="segmented">{(["Día","Semana","Mes"] as const).map(v=><button key={v} className={view===v?"selected":""} onClick={()=>setView(v)}>{v}</button>)}</div></div>{view==="Día"?<div className="day-agenda">{Array.from({length:12},(_,i)=>`${String(8+Math.floor(i/2)).padStart(2,"0")}:${i%2===0?"00":"30"}`).map(t=><div className="day-slot" key={t}><span>{t}</span><div>{appointments.filter(a=>a.time===t).map(a=><AgendaCard key={a.id} a={a} patient={patientById(patients,a.patientId)} onPatient={onPatient} onStatus={onStatus} onStart={onStart}/>)}</div></div>)}</div>:view==="Semana"?<div className="week-placeholder"><CalendarDays size={28}/><strong>Vista semanal</strong><p>Seleccioná un día para consultar sus turnos. La vista semanal completa se ampliará en la siguiente iteración de la demo.</p><button className="btn secondary" onClick={()=>setView("Día")}>Volver a vista diaria</button></div>:<div className="week-placeholder"><CalendarDays size={28}/><strong>Vista mensual</strong><p>La navegación mensual está disponible; la grilla completa se incorporará en la siguiente iteración.</p><button className="btn secondary" onClick={()=>setView("Día")}>Volver a vista diaria</button></div>}</div></>}
function AgendaCard({a,patient,onPatient,onStatus,onStart}:{a:Appointment;patient:Patient;onPatient:(id:number)=>void;onStatus:(id:number,s:AppointmentStatus)=>void;onStart:(id:number,appointmentId?:number)=>void}){return <div className="agenda-card"><div className="agenda-card-main"><strong>{a.time} · {fullName(patient)}</strong><span>{a.reason||"Consulta"}</span></div><StatusPill status={a.status}/><button className="text-action" onClick={()=>onPatient(patient.id)}>Ficha</button>{a.status==="Pendiente"?<button className="mini-action" onClick={()=>onStatus(a.id,"Confirmado")}>Confirmar</button>:a.status==="Confirmado"?<button className="mini-action" onClick={()=>onStart(patient.id,a.id)}>Iniciar consulta</button>:null}</div>}
function Consultations({consultations,patients,onOpen,onRectify}:{consultations:Consultation[];patients:Patient[];onOpen:(c:Consultation)=>void;onRectify:(c:Consultation)=>void}){const [filter,setFilter]=useState("Todas");const filtered=consultations.filter(c=>filter==="Todas"||(filter==="Borradores"&&c.status==="Borrador")||(filter==="Finalizadas"&&c.status==="Finalizada")||(filter==="Rectificaciones"&&c.rectification));return <><PageTitle eyebrow="HISTORIA CLÍNICA" title="Consultas" description="Borradores, evoluciones finalizadas y rectificaciones."/><div className="panel table-panel"><div className="list-toolbar"><div className="segmented">{["Todas","Borradores","Finalizadas","Rectificaciones"].map(f=><button key={f} className={filter===f?"selected":""} onClick={()=>setFilter(f)}>{f}</button>)}</div><span className="muted">{filtered.length} registros</span></div><div className="consultation-list">{filtered.map(c=><div className="consultation-item" key={c.id}><div className="consultation-date"><strong>{new Date(c.date+"T12:00:00").getDate()}</strong><span>{new Date(c.date+"T12:00:00").toLocaleDateString("es-AR",{month:"short"})}</span></div><div className="consultation-info"><strong>{fullName(patientById(patients,c.patientId))}</strong><span>{c.rectification?"Rectificación vinculada":c.reason||c.type} · {c.time}</span></div><StatusPill status={c.rectification?"Rectificación":c.status}/><div className="consultation-actions">{c.rectification?<button className="btn secondary small-btn" onClick={()=>onOpen(c)}><Eye size={15}/> Ver</button>:c.status==="Borrador"?<button className="btn secondary small-btn" onClick={()=>onOpen(c)}><Pencil size={15}/> Continuar</button>:<><button className="btn secondary small-btn" onClick={()=>onOpen(c)}><Eye size={15}/> Ver</button><button className="icon-button" title="Rectificar" onClick={()=>onRectify(c)}><FilePlus2 size={16}/></button></>}</div></div>)}{filtered.length===0&&<Empty icon={ClipboardList} title="No hay consultas en esta categoría" text="Los registros aparecerán aquí cuando se creen."/></>}</div></div></>}
function Documents({patients,search,setSearch}:{patients:Patient[];search:string;setSearch:(s:string)=>void}){const docs=[{name:"Laboratorio de control",patient:"Mariana Gómez",date:"18 nov 2026",type:"PDF"},{name:"Informe de imágenes",patient:"Carlos Fernández",date:"20 nov 2026",type:"PDF"},{name:"Estudio complementario",patient:"Lucía Martínez",date:"12 nov 2026",type:"Imagen"}].filter(d=>`${d.name} ${d.patient}`.toLowerCase().includes(search.toLowerCase()));return <><PageTitle eyebrow="ARCHIVO CLÍNICO" title="Documentos" description="Estudios y archivos asociados a tus pacientes."/><div className="panel table-panel"><div className="table-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar documento o paciente..."/></div><button className="btn secondary small-btn" onClick={()=>alert("La carga de archivos se habilitará en una etapa posterior.")}><Paperclip size={15}/> Adjuntar archivo</button></div><div className="document-list">{docs.map(d=><div className="document-row" key={d.name}><div className="document-icon"><FileText size={20}/></div><div className="document-info"><strong>{d.name}</strong><span>{d.patient} · Cargado el {d.date}</span></div><span className="file-type">{d.type}</span><button className="icon-button" title="Vista de demostración" onClick={()=>alert("Los archivos son ficticios. La carga y descarga privada se implementarán con el backend.")}><Download size={16}/></button></div>)}{docs.length===0&&<Empty icon={FileText} title="No hay documentos" text="Probá con otro término de búsqueda."/ >}</div></div><p className="helper-note"><ShieldCheck size={15}/> En la aplicación real, los archivos se almacenarán de forma privada y requerirán autorización profesional.</p></>}
function SettingsPage({doctor,specialty,onSwitch}:{doctor:{name:string;role:string;initials:string};specialty:Specialty;onSwitch:()=>void}){return <><PageTitle eyebrow="PREFERENCIAS" title="Configuración" description="Datos del profesional y organización de la agenda."/><div className="settings-grid"><section className="panel settings-card"><div className="settings-heading"><div className="stat-icon blue"><UserRound size={19}/></div><div><h2>Perfil profesional</h2><p>Información de la cuenta activa</p></div></div><div className="profile-large"><div className="avatar large">{doctor.initials}</div><div><strong>{doctor.name}</strong><span>{doctor.role}</span></div></div><Field label="Nombre y apellido"><input value={doctor.name} readOnly/></Field><Field label="Especialidad"><input value={specialty} readOnly/></Field><button className="btn secondary full" onClick={()=>alert("La edición de perfil se conectará al sistema de autenticación.")}>Editar perfil</button></section><section className="panel settings-card"><div className="settings-heading"><div className="stat-icon violet"><CalendarDays size={19}/></div><div><h2>Agenda y disponibilidad</h2><p>Configuración semanal de turnos</p></div></div><div className="schedule-setting"><div><strong>Duración habitual</strong><span>Tiempo asignado por consulta</span></div><strong>30 minutos</strong></div><div className="schedule-setting"><div><strong>Horario de atención</strong><span>Franjas configuradas por día</span></div><span className="muted">A definir</span></div><button className="btn secondary full" onClick={()=>alert("La configuración editable de franjas horarias se incorporará en la próxima iteración.")}>Configurar disponibilidad</button><div className="notice info"><ShieldCheck size={17}/> Tu agenda y tus pacientes se mantienen separados de los de la otra especialidad.</div><button className="text-action switch-doctor" onClick={onSwitch}>Cambiar profesional de demostración <ArrowUpRight size={15}/></button></section></div></>}
function PatientProfile({patient:p,consultations,tab,setTab,onBack,onConsult,onRectify}:{patient:Patient;consultations:Consultation[];tab:"Resumen"|"Historia clínica"|"Antecedentes"|"Documentos";setTab:(t:"Resumen"|"Historia clínica"|"Antecedentes"|"Documentos")=>void;onBack:()=>void;onConsult:()=>void;onRectify:(c:Consultation)=>void}){return <><button className="back-link" onClick={onBack}><ChevronLeft size={16}/> Volver a pacientes</button><div className="patient-profile-head"><div className="patient-heading"><div className="avatar profile-avatar">{initials(p)}</div><div><div className="eyebrow">FICHA DEL PACIENTE</div><h1>{fullName(p)}</h1><p>DNI {p.dni} · Nacimiento {formatDate(p.birth)}</p></div></div><div className="profile-actions"><button className="btn secondary" onClick={()=>alert("La edición de datos se habilitará con persistencia.")}><Pencil size={15}/> Editar ficha</button><button className="btn primary" onClick={onConsult}><Plus size={16}/> Nueva consulta</button></div></div><div className="patient-tabs">{(["Resumen","Historia clínica","Antecedentes","Documentos"] as const).map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>)}</div>
  {tab==="Resumen"&&<div className="patient-detail-grid"><section className="panel detail-card"><h2>Datos de contacto</h2><Info label="Teléfono" value={p.phone||"No registrado"}/><Info label="Email" value={p.email||"No registrado"}/><Info label="Estado" value={p.status}/><Info label="Última consulta" value={p.lastVisit}/></section><section className="panel detail-card"><div className="panel-heading"><div><h2>Antecedentes</h2><p>Referencia clínica del paciente</p></div><button className="text-action" onClick={()=>setTab("Antecedentes")}>Ver todos <ArrowUpRight size={14}/></button></div><Info label="Personales" value={p.personal}/><Info label="Alergias" value={p.allergies}/><Info label="Medicación habitual" value={p.medication}/></section><section className="panel detail-card wide-detail"><div className="panel-heading"><div><h2>Actividad clínica reciente</h2><p>Últimos registros del paciente</p></div><button className="text-action" onClick={()=>setTab("Historia clínica")}>Ver historia <ArrowUpRight size={14}/></button></div>{consultations.slice(0,3).map(c=><TimelineItem key={c.id} c={c}/>)}{consultations.length===0&&<Empty icon={ClipboardList} title="Sin consultas registradas" text="Podés iniciar la primera consulta desde esta ficha."/ >}</section></div>}
  {tab==="Historia clínica"&&<section className="panel detail-card"><div className="panel-heading"><div><h2>Historia clínica</h2><p>Registro cronológico de evoluciones</p></div><button className="btn primary small-btn" onClick={onConsult}><Plus size={15}/> Nueva consulta</button></div>{consultations.map(c=><div key={c.id}><TimelineItem c={c}/>{c.status==="Finalizada"&&!c.rectification&&<button className="text-action timeline-action" onClick={()=>onRectify(c)}>Registrar rectificación <ArrowUpRight size={14}/></button>}</div>)}{consultations.length===0&&<Empty icon={ClipboardList} title="Historia clínica vacía" text="Las evoluciones aparecerán en esta sección."/ >}</section>}
  {tab==="Antecedentes"&&<section className="panel detail-card"><div className="panel-heading"><div><h2>Antecedentes del paciente</h2><p>Información de referencia editable en el perfil</p></div><button className="btn secondary small-btn" onClick={()=>alert("La edición con auditoría se conectará al backend.")}><Pencil size={15}/> Editar antecedentes</button></div><Info label="Antecedentes personales" value={p.personal}/><Info label="Antecedentes familiares" value={p.family}/><Info label="Alergias" value={p.allergies}/><Info label="Medicación habitual" value={p.medication}/><div className="notice info">Estos antecedentes se consultan como referencia y no se copian automáticamente en cada evolución.</div></section>}
  {tab==="Documentos"&&<section className="panel detail-card"><div className="panel-heading"><div><h2>Documentos</h2><p>Archivos asociados a este paciente</p></div><button className="btn secondary small-btn" onClick={()=>alert("Adjuntar documentos se implementará con almacenamiento privado.")}><Paperclip size={15}/> Adjuntar</button></div><Empty icon={FileText} title="No hay documentos asociados" text="Los resultados y archivos adjuntos se mostrarán aquí."/></section>}
</>}
function Info({label,value}:{label:string;value:string}){return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>}
function TimelineItem({c}:{c:Consultation}){return <div className="timeline-item"><div className="timeline-dot"/><div className="timeline-content"><div className="timeline-meta"><strong>{formatDate(c.date)} · {c.time}</strong><StatusPill status={c.rectification?"Rectificación":c.status}/></div><h3>{c.rectification?"Rectificación de evolución":c.reason||c.type}</h3><p>{c.rectification||c.diagnosis||"Borrador de consulta en preparación."}</p>{c.rectification&&<small>Documento original conservado.</small>}</div></div>}
function ConsultationEditor({value,onChange,specialty,patient}:{value:Consultation;onChange:(c:Consultation)=>void;specialty:Specialty;patient:Patient}){const [showAntecedents,setShowAntecedents]=useState(false);const set=(key:keyof Consultation,v:string)=>onChange({...value,[key]:v} as Consultation);return <div className="consultation-editor"><div className="consultation-context"><div className="context-chip"><UserRound size={15}/>{fullName(patient)}</div><div className="context-chip"><Stethoscope size={15}/>{specialty}</div><div className="context-chip"><CalendarDays size={15}/>{formatDate(value.date)}</div></div><div className="notice info antecedent-toggle" onClick={()=>setShowAntecedents(v=>!v)}><div><ShieldCheck size={16}/><strong>Antecedentes del paciente</strong></div><button className="text-action">{showAntecedents?"Ocultar":"Consultar"} <ChevronDown size={15}/></button></div>{showAntecedents&&<div className="antecedent-summary"><Info label="Personales" value={patient.personal}/><Info label="Familiares" value={patient.family}/><Info label="Alergias" value={patient.allergies}/><Info label="Medicación" value={patient.medication}/></div>}<div className="form-grid"><Field label="Tipo de consulta"><select value={value.type} onChange={e=>set("type",e.target.value)}><option>Primera consulta</option><option>Seguimiento</option></select></Field><Field label="Motivo de consulta"><input value={value.reason} onChange={e=>set("reason",e.target.value)} placeholder="Motivo principal"/></Field></div>{consultationFields.map(([key,label,placeholder])=><Field key={key} label={label}><textarea rows={key==="notes"?2:3} value={value[key as keyof Consultation] as string} onChange={e=>set(key as keyof Consultation,e.target.value)} placeholder={placeholder}/></Field>)}<div className="specialty-note"><Activity size={16}/><span><strong>Sección específica · {specialty}</strong><small>Los campos clínicos específicos se definirán y validarán con los profesionales antes de la implementación definitiva.</small></span></div></div>}
const consultationFields:[string,string,string][]=[
  ["symptoms","Síntomas y evolución","Describí los síntomas y su evolución..."],
  ["exam","Examen físico","Hallazgos del examen físico..."],
  ["studies","Estudios","Estudios disponibles y resultados revisados..."],
  ["diagnosis","Diagnóstico","Diagnóstico o impresión diagnóstica..."],
  ["plan","Tratamiento y plan","Conducta, indicaciones y seguimiento..."],
  ["notes","Observaciones","Observaciones adicionales..."],
];
function ConsultationReadOnly({consultation:c}:{consultation:Consultation}){return <div className="readonly-consultation"><div className="notice success"><LockKeyhole size={16}/> Evolución finalizada · Solo lectura</div><div className="preview-head"><div><strong>{c.type}</strong><span>{formatDate(c.date)} · {c.time}</span></div><StatusPill status="Finalizada"/></div>{[["Motivo",c.reason],...consultationFields.map(([key,label])=>[label,c[key as keyof Consultation] as string])].map(([label,value])=><div className="preview-row" key={label}><strong>{label}</strong><p>{value||"Sin completar"}</p></div>)}</div>}
function Field({label,children}:{label:string;children:ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
function Modal({title,subtitle,onClose,children,wide=false}:{title:string;subtitle:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className={`modal ${wide?"modal-wide":""}`}><div className="modal-header"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div><div className="modal-body">{children}</div></div></div>}
function Empty({icon:Icon,title,text}:{icon:typeof Users;title:string;text:string}){return <div className="empty-state"><div><Icon size={22}/></div><strong>{title}</strong><p>{text}</p></div>}
