# Requerimientos funcionales y no funcionales

## 1. Contexto y alcance

Aplicación para un consultorio compartido por dos profesionales: Urología y Reumatología. Cada médico administra sus propios pacientes, turnos, consultas y documentos. No se contempla multiinstitución, recepción, administración de usuarios por un tercero ni registro público.

## 2. Usuarios y aislamiento

- Existen dos cuentas profesionales.
- Cada cuenta tiene una especialidad asignada.
- El profesional puede actualizar sus datos de perfil y contraseña, pero no cambiar su especialidad ni sus permisos.
- El acceso a los datos debe validarse en el backend y en las consultas a la base de datos; ocultar elementos en la interfaz no constituye control de seguridad.
- DNI es único dentro del registro de cada profesional. La misma persona puede tener registros separados en ambas especialidades.

## 3. Pacientes

- Alta, consulta y edición de pacientes propios.
- DNI, nombre, apellido y fecha de nacimiento obligatorios.
- Teléfono, email, domicilio y notas administrativas opcionales.
- Búsqueda por DNI, nombre o apellido.
- Antecedentes: personales, familiares, alergias y medicación habitual.
- Antecedentes editables desde el perfil y visibles como referencia durante la consulta; no se copian automáticamente a cada evolución.
- Registrar auditoría de cambios de antecedentes con autor, fecha/hora y valores anteriores/nuevos; motivo cuando corresponda.

## 4. Historia clínica y consultas

- Historia clínica independiente por profesional.
- Consultas con campos estructurados y observaciones libres.
- Orden común de campos: Motivo, Síntomas/evolución, Examen físico, Estudios, Diagnóstico, Tratamiento/plan y Observaciones.
- Diagnóstico de texto libre inicialmente.
- Distinguir primera consulta y seguimiento mediante sugerencia automática basada en consultas previas del mismo profesional; permitir corrección manual.
- Permitir varios borradores por paciente.
- Guardado manual de borradores; los borradores no bloquean nuevas consultas.
- Antes de finalizar, mostrar vista previa completa y solicitar confirmación.
- Una evolución finalizada queda bloqueada para edición y eliminación directa.
- Las correcciones se registran como rectificaciones separadas, vinculadas al documento original, con autor, fecha/hora, motivo y contenido. El original se conserva.
- Las consultas pueden incluir campos específicos de la especialidad; su contenido clínico debe ser validado por los médicos antes de implementarse como formulario definitivo.

## 5. Estudios y documentos

- Adjuntar resultados disponibles en PDF o imágenes.
- Asociar documentos a paciente y, cuando corresponda, a una consulta.
- Mostrar documentos en la sección general del paciente y vinculados a la consulta de origen.
- Metadatos previstos: nombre, categoría/tipo, fecha del estudio, fecha de carga, profesional, consulta relacionada y archivo.
- No se implementa seguimiento de estudios pendientes.
- Archivos privados, con validación de formato y tamaño y descarga autorizada.

## 6. Agenda

- Agenda independiente por profesional y navegación conjunta desde la aplicación.
- Configuración de días y horarios por profesional, con franjas variables por día.
- Duración habitual inicial: 30 minutos, configurable por profesional.
- Vistas día, semana y mes; vista diaria predeterminada.
- Alta de turnos por el médico; no hay autogestión por pacientes.
- Estados: Pendiente, Confirmado, Atendido, Cancelado y Ausente.
- Nuevo turno inicia Pendiente.
- Ausente se marca manualmente.
- Motivo de cancelación opcional; guardar autor y fecha/hora. La cancelación libera el horario y conserva el historial. Un turno cancelado no se reactiva; se crea uno nuevo.
- Reprogramar modifica el turno existente y registra horario anterior/nuevo, autor y fecha/hora. La reprogramación vuelve el turno a Pendiente.
- Turnos Atendidos no se reprograman.
- Cambios de disponibilidad advierten sobre turnos afectados; el médico los resuelve manualmente, sin desplazamiento automático.
- No se incluye módulo de vacaciones o bloqueos en esta etapa.
- Desde un turno se puede iniciar una consulta vinculada al paciente.
- El turno y la evolución son registros separados. Marcar el turno Atendido no finaliza la evolución.

## 7. Inicio

- Agenda del día y próximos turnos.
- Resumen de turnos y confirmaciones pendientes.
- Acciones rápidas para abrir paciente o turno.
- No incluir búsqueda general de pacientes en Inicio.

## 8. Seguridad y auditoría

- Autenticación de profesionales.
- Autorización por profesional en todas las operaciones del servidor.
- Registro de eventos sensibles: cambios de antecedentes, finalización y rectificación de evoluciones, cambios/reprogramaciones/cancelaciones de turnos y accesos o descargas de documentos según diseño de auditoría.
- No exponer archivos clínicos mediante enlaces públicos.
- Validación de datos en frontend y backend.
- Manejo seguro de contraseñas, sesiones y secretos de configuración.

## 9. Requisitos no funcionales

- Interfaz responsive, con experiencia completa en navegador de escritorio.
- Código organizado por módulos y responsabilidades.
- Persistencia PostgreSQL.
- Errores claros sin revelar información sensible.
- Pruebas de aislamiento entre profesionales, permisos, flujo de borrador/finalización y operaciones de agenda.
- No utilizar datos reales de pacientes en desarrollo, demostraciones o repositorios.
