import { CalendarDays, Download, Eye, FileImage, FileText } from "lucide-react";
import type { ClinicalDocument, Consultation, Patient } from "../../types";
import { fullName } from "../../utils/formatters";
import { EmptyState } from "../shared/EmptyState";

export function DocumentList({
  documents,
  patients,
  consultations,
}: {
  documents: ClinicalDocument[];
  patients: Patient[];
  consultations: Consultation[];
}) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Todavía no hay documentos"
        text="Los estudios y archivos que adjuntes aparecerán en esta sección."
      />
    );
  }

  return (
    <div className="clinical-document-list">
      {documents.map((document) => {
        const patient = patients.find((item) => item.id === document.patientId);
        const consultation = consultations.find(
          (item) => item.id === document.consultationId
        );
        const isImage = document.mimeType.startsWith("image/");

        return (
          <article className="clinical-document-row" key={document.id}>
            <div className="clinical-document-icon">
              {isImage ? <FileImage size={20} /> : <FileText size={20} />}
            </div>

            <div className="clinical-document-info">
              <strong>{document.name}</strong>
              <span>
                {patient ? fullName(patient) : "Paciente"} · {document.category}
              </span>
              {consultation && (
                <small>
                  Consulta:{" "}
                  {new Date(consultation.date + "T12:00:00").toLocaleDateString(
                    "es-AR"
                  )}{" "}
                  · {consultation.reason || consultation.type}
                </small>
              )}
              <small>
                <CalendarDays size={12} />{" "}
                {new Date(document.uploadedAt + "T12:00:00").toLocaleDateString(
                  "es-AR"
                )}{" "}
                · {(document.size / 1024).toFixed(0)} KB
              </small>
              {document.notes && <p>{document.notes}</p>}
              {!document.dataUrl && (
                <small className="document-metadata-note">
                  Registro de demostración: archivo original no disponible
                </small>
              )}
            </div>

            <div className="clinical-document-actions">
              <span className="file-type">
                {document.mimeType === "application/pdf"
                  ? "PDF"
                  : isImage
                    ? "Imagen"
                    : "Archivo"}
              </span>
              {document.dataUrl && (
                <>
                  <a
                    className="icon-button"
                    href={document.dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Abrir documento"
                    aria-label={`Abrir ${document.name}`}
                  >
                    <Eye size={16} />
                  </a>
                  <a
                    className="icon-button"
                    href={document.dataUrl}
                    download={document.name}
                    title="Descargar documento"
                    aria-label={`Descargar ${document.name}`}
                  >
                    <Download size={16} />
                  </a>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
