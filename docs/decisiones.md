# Decisiones funcionales y de producto

Este documento registra decisiones acordadas para evitar reinterpretaciones durante el desarrollo.

## Consultorio y usuarios

- Consultorio compartido por Urología y Reumatología.
- Dos profesionales, con acceso individual.
- Sin recepción, administración general, multiinstitución ni alta pública.
- Cada profesional trabaja exclusivamente con su registro clínico y agenda.
- Registros de pacientes separados por profesional; un mismo DNI puede existir en ambos registros.

## Historia clínica

- Antecedentes viven en el perfil del paciente y son referencia; no se replican automáticamente en cada evolución.
- Consulta inicial y seguimiento: sugerencia automática con posibilidad de corrección manual.
- Formulario híbrido: campos comunes más campos específicos por especialidad.
- Estudios: adjuntar resultados disponibles; sin control de pendientes.
- Consulta finalizada: documento inmutable. La corrección se hace mediante rectificación vinculada, conservando el original.
- Antes de finalizar se presenta una vista previa y confirmación.
- Se permiten múltiples borradores y guardado manual.

## Agenda

- Agenda por profesional con navegación combinada.
- Horarios configurables por día; duración inicial de 30 minutos.
- Vistas día/semana/mes; diaria como predeterminada.
- Reprogramación conserva el turno y registra historial; estado vuelve a Pendiente.
- Cancelación conserva el registro, libera el horario y no se reactiva.
- Cambios de disponibilidad requieren resolución manual de turnos afectados.
- No se incluye módulo de vacaciones/bloqueos en esta etapa.

## Documentos

- PDF e imágenes.
- Documentos vinculados al paciente y opcionalmente a consulta.
- Almacenamiento privado y autorización por profesional.

## Tecnología prevista

- React + TypeScript + Vite.
- Node.js + Express + TypeScript.
- PostgreSQL.
- Tailwind CSS.

## Pendiente explícito

Aún no se decidió si se permitirán consultas sin turno: permitir, exigir turno o soportar ambas modalidades. No implementar una regla hasta resolverlo.
