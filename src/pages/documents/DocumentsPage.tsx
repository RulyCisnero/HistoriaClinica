import { useMemo, useState } from "react";
import { Paperclip, Search } from "lucide-react";
import type { ClinicalDocument, Consultation, Patient } from "../../types";
import { PageTitle } from "../../components/shared/PageTitle";
import { DocumentList } from "../../components/documents/DocumentList";
import { EmptyState } from "../../components/shared/EmptyState";

export function DocumentsPage({
  patients,
  documents,
  consultations,
  search,
  setSearch,
  onUpload,
}: {
  patients: Patient[];
  documents: ClinicalDocument[];
  consultations: Consultation[];
  search: string;
  setSearch: (value: string) => void;
  onUpload: () => void;
}) {
  const [patientFilter, setPatientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const filtered = useMemo(() => documents.filter((document) => {
    const patient = patients.find((item) => item.id === document.patientId);
    const matchesSearch = `${document.name} ${patient?.firstName ?? ""} ${patient?.lastName ?? ""} ${document.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (patientFilter === "all" || String(document.patientId) === patientFilter) && (categoryFilter === "all" || document.category === categoryFilter);
  }), [documents, patients, search, patientFilter, categoryFilter]);

  return (
    <>
      <PageTitle eyebrow="ARCHIVO CLÍNICO" title="Estudios y documentos" description="Consultá los archivos adjuntos a las consultas de tus pacientes." action={<button className="btn primary" onClick={onUpload}><Paperclip size={16} /> Adjuntar archivo</button>} />
      <div className="panel table-panel">
        <div className="documents-toolbar">
          <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por documento o paciente..." /></div>
          <select value={patientFilter} onChange={(event) => setPatientFilter(event.target.value)}><option value="all">Todos los pacientes</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.lastName}, {patient.firstName}</option>)}</select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Todas las categorías</option>{["Laboratorio", "Diagnóstico por imágenes", "Informe médico", "Análisis", "Otro"].map((category) => <option key={category}>{category}</option>)}</select>
        </div>
        <div className="document-results-heading"><strong>{filtered.length} archivos</strong><span>Solo documentos del registro de {patients.length} pacientes</span></div>
        <DocumentList documents={filtered} patients={patients} consultations={consultations} />
      </div>
      <p className="helper-note">Los archivos se vinculan a una consulta y permanecen asociados al paciente. En esta versión de demostración se guardan temporalmente en el navegador.</p>
    </>
  );
}

