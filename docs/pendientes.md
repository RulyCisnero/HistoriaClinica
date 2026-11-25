# Pendientes de validación

Estos puntos deben resolverse antes de cerrar diseño o implementar reglas definitivas.

## Funcionales

- [ ] ¿Se permiten consultas sin turno, se exige turno o se soportan ambas modalidades?
- [ ] Validar catálogo de sexo/género y qué dato clínico/administrativo se necesita registrar.
- [ ] Validar con ambos médicos los campos específicos de Urología.
- [ ] Validar con ambos médicos los campos específicos de Reumatología.
- [ ] Definir categorías de documentos y límites máximos de archivo.
- [ ] Confirmar qué eventos de acceso/descarga se registran en auditoría.
- [ ] Definir reglas de búsqueda y visualización de DNI para minimizar exposición innecesaria.

## Técnicos y seguridad

- [ ] Elegir estrategia de autenticación y sesiones (por ejemplo, cookie HttpOnly segura) y protección CSRF según arquitectura.
- [ ] Definir proveedor de almacenamiento privado de archivos y política de acceso/retención.
- [ ] Definir estrategia de backups y restauración de PostgreSQL y documentos.
- [ ] Definir hosting, dominios y configuración de entornos.
- [ ] Definir política de expiración de sesión, cierre de sesión y recuperación de contraseña.
- [ ] Definir validación de tipo real de archivo, tamaño, antivirus/escaneo y nombres internos.
- [ ] Definir política de logs: no incluir datos clínicos ni credenciales.
- [ ] Evaluar cifrado en tránsito, cifrado en reposo y gestión de secretos.
- [ ] Definir pruebas automatizadas de aislamiento entre profesionales y acceso a archivos.

## Desarrollo

- [ ] Confirmar estructura de monorepo o repos separados frontend/backend.
- [ ] Definir convenciones de nombres, linting, formato y estrategia de migraciones.
- [ ] Crear wireframes validados antes de construir formularios clínicos definitivos.
