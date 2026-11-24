# Modelo de datos inicial

Modelo conceptual preliminar. Debe convertirse en esquema PostgreSQL y revisarse antes de crear migraciones.

## Entidades

### Professional

- id
- nombre y apellido
- especialidad (Urología o Reumatología)
- email/login
- password_hash
- activo

### Patient

- id
- professional_id (propietario del registro)
- dni
- nombre
- apellido
- fecha_nacimiento
- sexo (catálogo pendiente de validar)
- teléfono, email, domicilio
- notas administrativas
- created_at / updated_at

Restricción: unique(professional_id, dni). El aislamiento se aplica en backend a todas las lecturas y escrituras.

### PatientAntecedents

- id
- patient_id
- antecedentes_personales
- antecedentes_familiares
- alergias
- medicacion_habitual
- updated_at
- updated_by

Los cambios deben generar eventos de auditoría con valores anteriores/nuevos.

### Appointment

- id
- professional_id
- patient_id
- start_at / end_at
- status
- motivo (opcional)
- cancellation_reason (opcional)
- created_at / created_by

El historial de cambios de horario, estado y cancelación debe conservarse en una entidad de auditoría o historial dedicada.

### ProfessionalSchedule

- id
- professional_id
- weekday
- start_time / end_time
- slot_duration_minutes
- configuración activa

Permitir más de una franja por día.

### Consultation

- id
- professional_id
- patient_id
- appointment_id (nullable hasta resolver consultas sin turno)
- consultation_type (inicial/seguimiento, corregible)
- status (draft/finalized)
- motivo, sintomas_evolucion, examen_fisico, estudios_texto, diagnostico, tratamiento_plan, observaciones
- specialty_data (estructura a validar; evitar fijar campos clínicos sin aprobación)
- created_at / updated_at
- finalized_at / finalized_by

### ConsultationRectification

- id
- consultation_id (documento original)
- professional_id
- reason
- content
- created_at / created_by

El original finalizado no se modifica.

### ClinicalDocument

- id
- professional_id
- patient_id
- consultation_id (nullable)
- name / category
- study_date (nullable)
- uploaded_at / uploaded_by
- storage_key (ruta interna privada, nunca URL pública)
- mime_type / size_bytes

### AuditEvent

- id
- professional_id / actor_id
- entity_type / entity_id
- action
- old_value / new_value (JSON cuando corresponda)
- reason (nullable)
- created_at

## Reglas transversales

- No confiar en professional_id enviado por el cliente; derivar el propietario del usuario autenticado o validar estrictamente su pertenencia.
- Usar claves foráneas y restricciones de integridad.
- Definir transacciones para finalizar consultas y registrar eventos asociados.
- La autorización debe comprobarse en cada endpoint.
- Revisar si conviene reforzar el aislamiento con PostgreSQL Row-Level Security como defensa adicional.
