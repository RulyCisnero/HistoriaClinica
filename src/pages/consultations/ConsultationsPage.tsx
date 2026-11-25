/* import { Activity, CalendarDays, ChevronDown, ClipboardList, ShieldCheck, Stethoscope, UserRound, FilePlus2, Pencil, Eye, LockKeyhole, Info } from "lucide-react";
import { useState } from "react";
import type { Consultation, Patient, Specialty } from "../../types";
import { formatDate, fullName, patientById } from "../../utils/formatters";
import { PageTitle } from "../../components/shared/PageTitle";
import { StatusPill } from "../../components/shared/StatusPill";
import { EmptyState } from "../../components/shared/EmptyState";
import { FormField } from "../../components/shared/FormField";
export function ConsultationsPage({ consultations, patients, onOpen, onRectify }: { consultations: Consultation[]; patients: Patient[]; onOpen: (c: Consultation) => void; onRectify: (c: Consultation) => void }) { const [filter, setFilter] = useState("Todas"); const filtered = consultations.filter(c => filter === "Todas" || (filter === "Borradores" && c.status === "Borrador") || (filter === "Finalizadas" && c.status === "Finalizada") || (filter === "Rectificaciones" && c.rectification)); return <><PageTitle eyebrow="HISTORIA CLÍNICA" title="Consultas" description="Borradores, evoluciones finalizadas y rectificaciones." /><div className="panel table-panel"><div className="list-toolbar"><div className="segmented">{["Todas", "Borradores", "Finalizadas", "Rectificaciones"].map(f => <button key={f} className={filter === f ? "selected" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div><span className="muted">{filtered.length} registros</span></div><div className="consultation-list">{filtered.map(c => <div className="consultation-item" key={c.id}><div className="consultation-date"><strong>{new Date(c.date + "T12:00:00").getDate()}</strong><span>{new Date(c.date + "T12:00:00").toLocaleDateString("es-AR", { month: "short" })}</span></div><div className="consultation-info"><strong>{fullName(patientById(patients, c.patientId))}</strong><span>{c.rectification ? "Rectificación vinculada" : c.reason || c.type} · {c.time}</span></div><StatusPill status={c.rectification ? "Rectificación" : c.status} /><div className="consultation-actions">{c.rectification ? <button className="btn secondary small-btn" onClick={() => onOpen(c)}><Eye size={15} /> Ver</button> : c.status === "Borrador" ? <button className="btn secondary small-btn" onClick={() => onOpen(c)}><Pencil size={15} /> Continuar</button> : <><button className="btn secondary small-btn" onClick={() => onOpen(c)}><Eye size={15} /> Ver</button><button className="icon-button" title="Rectificar" onClick={() => onRectify(c)}><FilePlus2 size={16} /></button></>}</div></div>)}{filtered.length === 0 && <EmptyState icon={ClipboardList} title="No hay consultas en esta categoría" text="Los registros aparecerán aquí cuando se creen." /></>}</div></div >}
export const consultationFields: [string, string, string][] = [
  ["symptoms", "Síntomas y evolución", "Describí los síntomas y su evolución..."],
  ["exam", "Examen físico", "Hallazgos del examen físico..."],
  ["studies", "Estudios", "Estudios disponibles y resultados revisados..."],
  ["diagnosis", "Diagnóstico", "Diagnóstico o impresión diagnóstica..."],
  ["plan", "Tratamiento y plan", "Conducta, indicaciones y seguimiento..."],
  ["notes", "Observaciones", "Observaciones adicionales..."],
];
export function ConsultationEditor({ value, onChange, specialty, patient }: { value: Consultation; onChange: (c: Consultation) => void; specialty: Specialty; patient: Patient }) { const [showAntecedents, setShowAntecedents] = useState(false); const set = (key: keyof Consultation, v: string) => onChange({ ...value, [key]: v } as Consultation); return <div className="consultation-editor"><div className="consultation-context"><div className="context-chip"><UserRound size={15} />{fullName(patient)}</div><div className="context-chip"><Stethoscope size={15} />{specialty}</div><div className="context-chip"><CalendarDays size={15} />{formatDate(value.date)}</div></div><div className="notice info antecedent-toggle" onClick={() => setShowAntecedents(v => !v)}><div><ShieldCheck size={16} /><strong>Antecedentes del paciente</strong></div><button className="text-action">{showAntecedents ? "Ocultar" : "Consultar"} <ChevronDown size={15} /></button></div>{showAntecedents && <div className="antecedent-summary"><Info label="Personales" value={patient.personal} /><Info label="Familiares" value={patient.family} /><Info label="Alergias" value={patient.allergies} /><Info label="Medicación" value={patient.medication} /></div>}<section className="coverage-section">
        <div className="coverage-heading"><div><strong>Obra social / prepaga</strong><p>Seleccioná la cobertura correspondiente a esta consulta.</p></div></div>
        <FormField label="Cobertura utilizada"><select value={value.coverage?.id ?? ""} onChange={(e) => {
          const selectedCoverage = patient.insuranceCoverages?.find((coverage) => String(coverage.id) === e.target.value) ?? null;
          onChange({ ...value, coverage: selectedCoverage });
        }}>
          <option value="">Sin cobertura / particular</option>
          {(patient.insuranceCoverages ?? []).map((coverage) => <option key={coverage.id} value={coverage.id} disabled={coverage.status !== "Activa"}>{coverage.provider} · {coverage.plan} · Asociado {coverage.memberNumber}{coverage.status !== "Activa" ? " (inactiva)" : ""}</option>)}
        </select></FormField>
        {value.coverage && <div className="coverage-detail"><span>Obra social / prepaga: <strong>{value.coverage.provider}</strong></span><span>Plan: <strong>{value.coverage.plan}</strong></span><span>N.º de asociado: <strong>{value.coverage.memberNumber}</strong></span></div>}
        {(patient.insuranceCoverages ?? []).length === 0 && <p className="form-hint">Este paciente no tiene coberturas registradas. Podés continuar como particular.</p>}
      </section><div className="form-grid"><FormField label="Tipo de consulta"><select value={value.type} onChange={e => set("type", e.target.value)}><option>Primera consulta</option><option>Seguimiento</option></select></FormField><FormField label="Motivo de consulta"><input value={value.reason} onChange={e => set("reason", e.target.value)} placeholder="Motivo principal" /></FormField></div>{consultationFields.map(([key, label, placeholder]) => <FormField key={key} label={label}><textarea rows={key === "notes" ? 2 : 3} value={value[key as keyof Consultation] as string} onChange={e => set(key as keyof Consultation, e.target.value)} placeholder={placeholder} /></FormField>)}<div className="specialty-note"><Activity size={16} /><span><strong>Sección específica · {specialty}</strong><small>Los campos clínicos específicos se definirán y validarán con los profesionales antes de la implementación definitiva.</small></span></div></div> }
export function ConsultationReadOnly({ consultation: c }: { consultation: Consultation }) { return <div className="readonly-consultation"><div className="notice success"><LockKeyhole size={16} /> Evolución finalizada · Solo lectura</div><div className="preview-head"><div><strong>{c.type}</strong><span>{formatDate(c.date)} · {c.time}</span></div><StatusPill status="Finalizada" /></div>{[["Motivo", c.reason], ["Obra social / prepaga", c.coverage ? `${c.coverage.provider} · ${c.coverage.plan} · Asociado ${c.coverage.memberNumber}` : "Particular / sin cobertura"], ...consultationFields.map(([key, label]) => [label, c[key as keyof Consultation] as string])].map(([label, value]) => <div className="preview-row" key={label}><strong>{label}</strong><p>{value || "Sin completar"}</p></div>)}</div> } */

import {
  Activity,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  ShieldCheck,
  Stethoscope,
  UserRound,
  FilePlus2,
  Pencil,
  Eye,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import type { Consultation, Patient, Specialty } from "../../types";
import { formatDate, fullName, patientById } from "../../utils/formatters";
import { PageTitle } from "../../components/shared/PageTitle";
import { StatusPill } from "../../components/shared/StatusPill";
import { EmptyState } from "../../components/shared/EmptyState";
import { FormField } from "../../components/shared/FormField";

export function ConsultationsPage({
  consultations,
  patients,
  onOpen,
  onRectify,
}: {
  consultations: Consultation[];
  patients: Patient[];
  onOpen: (c: Consultation) => void;
  onRectify: (c: Consultation) => void;
}) {
  const [filter, setFilter] = useState("Todas");

  const filtered = consultations.filter(
    (c) =>
      filter === "Todas" ||
      (filter === "Borradores" && c.status === "Borrador") ||
      (filter === "Finalizadas" && c.status === "Finalizada") ||
      (filter === "Rectificaciones" && c.rectification)
  );

  return (
    <>
      <PageTitle
        eyebrow="HISTORIA CLÍNICA"
        title="Consultas"
        description="Borradores, evoluciones finalizadas y rectificaciones."
      />
      <div className="panel table-panel">
        <div className="list-toolbar">
          <div className="segmented">
            {["Todas", "Borradores", "Finalizadas", "Rectificaciones"].map((f) => (
              <button
                key={f}
                className={filter === f ? "selected" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="muted">{filtered.length} registros</span>
        </div>

        <div className="consultation-list">
          {filtered.map((c) => (
            <div className="consultation-item" key={c.id}>
              <div className="consultation-date">
                <strong>{new Date(c.date + "T12:00:00").getDate()}</strong>
                <span>
                  {new Date(c.date + "T12:00:00").toLocaleDateString("es-AR", {
                    month: "short",
                  })}
                </span>
              </div>
              <div className="consultation-info">
                <strong>{fullName(patientById(patients, c.patientId))}</strong>
                <span>
                  {c.rectification ? "Rectificación vinculada" : c.reason || c.type} ·{" "}
                  {c.time}
                </span>
              </div>
              <StatusPill status={c.rectification ? "Rectificación" : c.status} />
              <div className="consultation-actions">
                {c.rectification ? (
                  <button
                    className="btn secondary small-btn"
                    onClick={() => onOpen(c)}
                  >
                    <Eye size={15} /> Ver
                  </button>
                ) : c.status === "Borrador" ? (
                  <button
                    className="btn secondary small-btn"
                    onClick={() => onOpen(c)}
                  >
                    <Pencil size={15} /> Continuar
                  </button>
                ) : (
                  <>
                    <button
                      className="btn secondary small-btn"
                      onClick={() => onOpen(c)}
                    >
                      <Eye size={15} /> Ver
                    </button>
                    <button
                      className="icon-button"
                      title="Rectificar"
                      onClick={() => onRectify(c)}
                    >
                      <FilePlus2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <EmptyState
              icon={ClipboardList}
              title="No hay consultas en esta categoría"
              text="Los registros aparecerán aquí cuando se creen."
            />
          )}
        </div>
      </div>
    </>
  );
}

export const consultationFields: [string, string, string][] = [
  ["symptoms", "Síntomas y evolución", "Describí los síntomas y su evolución..."],
  ["exam", "Examen físico", "Hallazgos del examen físico..."],
  ["studies", "Estudios", "Estudios disponibles y resultados revisados..."],
  ["diagnosis", "Diagnóstico", "Diagnóstico o impresión diagnóstica..."],
  ["plan", "Tratamiento y plan", "Conducta, indicaciones y seguimiento..."],
  ["notes", "Observaciones", "Observaciones adicionales..."],
];

export function ConsultationEditor({
  value,
  onChange,
  specialty,
  patient,
}: {
  value: Consultation;
  onChange: (c: Consultation) => void;
  specialty: Specialty;
  patient: Patient;
}) {
  const [showAntecedents, setShowAntecedents] = useState(false);

  const set = (key: keyof Consultation, v: string) =>
    onChange({ ...value, [key]: v } as Consultation);

  return (
    <div className="consultation-editor">
      <div className="consultation-context">
        <div className="context-chip">
          <UserRound size={15} />
          {fullName(patient)}
        </div>
        <div className="context-chip">
          <Stethoscope size={15} />
          {specialty}
        </div>
        <div className="context-chip">
          <CalendarDays size={15} />
          {formatDate(value.date)}
        </div>
      </div>

      <div
        className="notice info antecedent-toggle"
        onClick={() => setShowAntecedents((v) => !v)}
      >
        <div>
          <ShieldCheck size={16} />
          <strong>Antecedentes del paciente</strong>
        </div>
        <button type="button" className="text-action">
          {showAntecedents ? "Ocultar" : "Consultar"} <ChevronDown size={15} />
        </button>
      </div>

      {showAntecedents && (
        <div className="antecedent-summary">
          <div>
            <strong>Personales:</strong> <span>{patient.personal || "Sin datos"}</span>
          </div>
          <div>
            <strong>Familiares:</strong> <span>{patient.family || "Sin datos"}</span>
          </div>
          <div>
            <strong>Alergias:</strong> <span>{patient.allergies || "Sin datos"}</span>
          </div>
          <div>
            <strong>Medicación:</strong> <span>{patient.medication || "Sin datos"}</span>
          </div>
        </div>
      )}

      <div className="form-grid">
        <FormField label="Tipo de consulta">
          <select
            value={value.type}
            onChange={(e) => set("type", e.target.value)}
          >
            <option>Primera consulta</option>
            <option>Seguimiento</option>
          </select>
        </FormField>
        <FormField label="Motivo de consulta">
          <input
            value={value.reason}
            onChange={(e) => set("reason", e.target.value)}
            placeholder="Motivo principal"
          />
        </FormField>
      </div>

      {consultationFields.map(([key, label, placeholder]) => (
        <FormField key={key} label={label}>
          <textarea
            rows={key === "notes" ? 2 : 3}
            value={(value[key as keyof Consultation] as string) ?? ""}
            onChange={(e) => set(key as keyof Consultation, e.target.value)}
            placeholder={placeholder}
          />
        </FormField>
      ))}

      <div className="specialty-note">
        <Activity size={16} />
        <span>
          <strong>Sección específica · {specialty}</strong>
          <small>
            Los campos clínicos específicos se definirán y validarán con los
            profesionales antes de la implementación definitiva.
          </small>
        </span>
      </div>
    </div>
  );
}

export function ConsultationReadOnly({ consultation: c }: { consultation: Consultation }) {
  return (
    <div className="readonly-consultation">
      <div className="notice success">
        <LockKeyhole size={16} /> Evolución finalizada · Solo lectura
      </div>
      <div className="preview-head">
        <div>
          <strong>{c.type}</strong>
          <span>
            {formatDate(c.date)} · {c.time}
          </span>
        </div>
        <StatusPill status="Finalizada" />
      </div>
      {[
        ["Motivo", c.reason],
        ...consultationFields.map(([key, label]) => [
          label,
          c[key as keyof Consultation] as string,
        ]),
      ].map(([label, value]) => (
        <div className="preview-row" key={label}>
          <strong>{label}</strong>
          <p>{value || "Sin completar"}</p>
        </div>
      ))}
    </div>
  );
}