import { Paperclip } from "lucide-react";
import type { ClinicalDocument, Consultation, Patient } from "../../types";
import { DocumentList } from "./DocumentList";
import { EmptyState } from "../shared/EmptyState";

export function PatientDocumentsPanel({
  patient,
  documents,
  consultations,
  onUpload,
}: {
  patient: Patient;
  documents: ClinicalDocument[];
  consultations: Consultation[];
  onUpload: () => void;
}) {
  const patientDocuments = documents.filter((document) => document.patientId === patient.id);
  return (
    <section className="panel detail-card">
      <div className="panel-heading"><div><h2>Estudios y documentos</h2><p>Archivos vinculados a las consultas de este paciente</p></div><button className="btn secondary small-btn" onClick={onUpload}><Paperclip size={15} /> Adjuntar</button></div>
      {patientDocuments.length ? <DocumentList documents={patientDocuments} patients={[patient]} consultations={consultations} /> : <EmptyState icon={Paperclip} title="Sin documentos asociados" text="Podés adjuntar resultados de laboratorio, imágenes e informes desde aquí." />}
    </section>
  );
}
