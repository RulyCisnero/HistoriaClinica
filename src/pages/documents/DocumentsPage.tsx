import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  X,
  AlertCircle,
  ArrowUpRight,
  Paperclip,
  Save,
  CheckCircle2,
  FilePlus2,
  SlidersHorizontal,
  Bell,
  CalendarCheck,
  Filter,
  Pencil,
  Eye,
  Download,
  LockKeyhole,
} from "lucide-react";
import type { Patient } from "../../types";
import { PageTitle } from "../../components/shared/PageTitle";
import { EmptyState } from "../../components/shared/EmptyState";
export function DocumentsPage({
  patients,
  search,
  setSearch,
}: {
  patients: Patient[];
  search: string;
  setSearch: (s: string) => void;
}) {
  const docs = [
    { name: "Laboratorio de control", patient: "Mariana Gómez", date: "18 nov 2026", type: "PDF" },
    { name: "Informe de imágenes", patient: "Carlos Fernández", date: "20 nov 2026", type: "PDF" },
    {
      name: "Estudio complementario",
      patient: "Lucía Martínez",
      date: "12 nov 2026",
      type: "Imagen",
    },
  ].filter((d) => `${d.name} ${d.patient}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <PageTitle
        eyebrow="ARCHIVO CLÍNICO"
        title="Documentos"
        description="Estudios y archivos asociados a tus pacientes."
      />
      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar documento o paciente..."
            />
          </div>
          <button
            className="btn secondary small-btn"
            onClick={() => alert("La carga de archivos se habilitará en una etapa posterior.")}
          >
            <Paperclip size={15} /> Adjuntar archivo
          </button>
        </div>
        <div className="document-list">
          {docs.map((d) => (
            <div className="document-row" key={d.name}>
              <div className="document-icon">
                <FileText size={20} />
              </div>
              <div className="document-info">
                <strong>{d.name}</strong>
                <span>
                  {d.patient} · Cargado el {d.date}
                </span>
              </div>
              <span className="file-type">{d.type}</span>
              <button
                className="icon-button"
                title="Vista de demostración"
                onClick={() =>
                  alert(
                    "Los archivos son ficticios. La carga y descarga privada se implementarán con el backend.",
                  )
                }
              >
                <Download size={16} />
              </button>
            </div>
          ))}
          {docs.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No hay documentos"
              text="Probá con otro término de búsqueda."
            />
          )}
        </div>
      </div>
      <p className="helper-note">
        <ShieldCheck size={15} /> En la aplicación real, los archivos se almacenarán de forma
        privada y requerirán autorización profesional.
      </p>
    </>
  );
}
