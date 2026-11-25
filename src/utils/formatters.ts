import type { Patient } from "../types";
export const initials = (p: Patient) => `${p.firstName[0]}${p.lastName[0]}`;
export const fullName = (p: Patient) => `${p.firstName} ${p.lastName}`;
export const formatDate = (value: string) =>
  new Date(value + "T12:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
export const patientById = (patients: Patient[], id: number) => patients.find((p) => p.id === id)!;
