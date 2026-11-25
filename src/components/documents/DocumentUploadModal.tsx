import { useState } from "react";
import { FileUp, Paperclip } from "lucide-react";
import type { ClinicalDocument, ClinicalDocumentCategory, Consultation, Patient } from "../../types";
import { Modal } from "../shared/Modal";
import { FormField } from "../shared/FormField";

const categories: ClinicalDocumentCategory[] = [
  "Laboratorio",
  "Diagnóstico por imágenes",
  "Informe médico",
  "Análisis",
  "Otro",
];

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export function DocumentUploadModal({
  patients,
  consultations,
  initialPatientId,
  onClose,
  onSave,
}: {
  patients: Patient[];
  consultations: Consultation[];
  initialPatientId?: number;
  onClose: () => void;
  onSave: (document: ClinicalDocument) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState(String(initialPatientId ?? ""));
  const [consultationId, setConsultationId] = useState("");
  const [category, setCategory] = useState<ClinicalDocumentCategory>("Laboratorio");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selectFile = (selected: File | undefined) => {
    setError("");
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Formato no permitido. Adjuntá PDF, JPG, PNG o WEBP.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("El archivo supera el máximo de 8 MB.");
      return;
    }
    setFile(selected);
  };

  const patientConsultations = consultations.filter((item) => item.patientId === Number(patientId) && item.status === "Finalizada").sort((a, b) => b.date.localeCompare(a.date));

  const save = () => {
    if (!patientId) { setError("Seleccioná un paciente."); return; }
    if (!consultationId) { setError("Seleccioná la consulta a la que pertenece el documento."); return; }
    if (!file) {
      setError("Seleccioná un archivo para continuar.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onSave({
        id: Date.now(),
        patientId: Number(patientId),
        consultationId: Number(consultationId),
        name: file.name,
        category,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString().slice(0, 10),
        notes: notes.trim(),
        dataUrl: typeof reader.result === "string" ? reader.result : undefined,
      });
    };
    reader.onerror = () => setError("No se pudo leer el archivo. Intentá nuevamente.");
    reader.readAsDataURL(file);
  };

  return (
    <Modal title="Adjuntar estudio o documento" subtitle="El archivo quedará vinculado al paciente y a la consulta seleccionada." onClose={onClose}>
      <div className="form-stack">
        <FormField label="Archivo *">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => selectFile(event.target.files?.[0])} />
        </FormField>
        {file && <div className="selected-document-file"><FileUp size={17} /><span><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(0)} KB</small></span></div>}
        <FormField label="Tipo de documento">
          <select value={category} onChange={(event) => setCategory(event.target.value as ClinicalDocumentCategory)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </FormField>
        <FormField label="Observaciones (opcional)">
          <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Descripción breve del estudio o documento..." />
        </FormField>
        <p className="form-hint">Formatos permitidos: PDF, JPG, PNG y WEBP. Tamaño máximo: 8 MB.</p>
        {error && <p className="form-error">{error}</p>}
      </div>
      <div className="modal-actions">
        <button className="btn secondary" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={save}><Paperclip size={16} /> Adjuntar archivo</button>
      </div>
    </Modal>
  );
}
