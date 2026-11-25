import { CalendarDays, ClipboardList, FileText, LayoutDashboard, Settings, Users } from "lucide-react";
import type { Section } from "../types";
export const navItems: { label: Section; icon: typeof LayoutDashboard }[] = [
 {label:"Inicio",icon:LayoutDashboard},{label:"Agenda",icon:CalendarDays},{label:"Pacientes",icon:Users},
 {label:"Consultas",icon:ClipboardList},{label:"Documentos",icon:FileText},{label:"Configuración",icon:Settings}
];
