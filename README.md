# Historia Clínica

Sistema web de historia clínica y gestión de agenda para un consultorio compartido por dos profesionales: Urología y Reumatología.

## Alcance

Aplicación de uso interno para los dos médicos. No es un sistema multiinstitución ni contempla registro público de pacientes, recepción o administración general.

- Cada profesional accede únicamente a sus pacientes, agenda, consultas y documentos.
- Los registros clínicos se mantienen separados por profesional/especialidad.
- La misma persona puede estar registrada con ambos médicos, con historias independientes.
- La aplicación estará pensada para navegador de escritorio y será adaptable a móviles.

## Tecnologías previstas

- Frontend: React, TypeScript, Vite y Tailwind CSS.
- Backend: Node.js, Express y TypeScript.
- Base de datos: PostgreSQL.
- Archivos clínicos: almacenamiento privado con acceso controlado.

La selección final de autenticación, despliegue y almacenamiento queda documentada como decisión técnica pendiente.

## Documentación

- [Requerimientos](docs/requerimientos.md)
- [Decisiones funcionales](docs/decisiones.md)
- [Pantallas y navegación](docs/pantallas.md)
- [Modelo de datos inicial](docs/modelo-datos.md)
- [Pendientes de validación](docs/pendientes.md)

## Estado

Etapa inicial: definición y documentación. Aún no existe una aplicación funcional ni persistencia de datos. Los prototipos previos son demostraciones visuales con datos ficticios.
