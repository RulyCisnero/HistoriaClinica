# Demo frontend — Historia Clínica

Primera versión interactiva de la demo del consultorio compartido por Urología y Reumatología.

## Requisitos

- Node.js 20 o superior (recomendado).
- npm.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Vite mostrará una URL local, normalmente `http://localhost:5173`.

Para validar la compilación:

```bash
npm run build
npm run preview
```

## Qué incluye esta iteración

- Navegación principal: Inicio, Agenda, Pacientes, Consultas, Documentos y Configuración.
- Selector de profesional/especialidad con registros ficticios independientes para cada especialidad.
- Panel de inicio con resumen de agenda y acciones rápidas.
- Agenda diaria con creación de turnos, confirmación e inicio de consulta.
- Alta y búsqueda de pacientes.
- Ficha de paciente con resumen, antecedentes, historia clínica y documentos.
- Consultas con borradores, edición, vista previa y finalización.
- Evoluciones finalizadas en modo lectura y registro de rectificaciones de demostración.
- Diseño adaptable a escritorio y móvil.

## Límites importantes

Esta entrega es exclusivamente una demostración frontend:

- Los datos son ficticios.
- Los cambios viven en el estado de la aplicación y se pierden al recargar.
- No hay autenticación real ni autorización en servidor.
- No hay API, PostgreSQL ni almacenamiento de archivos.
- Las acciones de configuración y archivos que todavía no tienen backend muestran mensajes informativos.
- No utilizar para registrar ni tratar información real de pacientes.

La separación real de datos entre profesionales, auditoría, protección de archivos, persistencia y controles de seguridad deben implementarse y probarse en backend antes de cualquier uso clínico.

## Documentación funcional

Consultar `docs/requerimientos.md`, `docs/decisiones.md`, `docs/pantallas.md` y `docs/modelo-datos.md`.
