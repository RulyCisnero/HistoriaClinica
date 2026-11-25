# Historia Clínica — Demo frontend

Demo interactiva del consultorio compartido por Urología y Reumatología.

## Requisitos

- Node.js 20 o superior (recomendado).
- npm.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Vite mostrará una URL local, normalmente `http://localhost:5173`.

Para mantener el formato consistente y validar la compilación:

```bash
npm run format
npm run format:check
npm run build
npm run preview
```

La configuración de Prettier está centralizada en `.prettierrc.json`. También hay una validación automática de formato y compilación en GitHub Actions.

## Arquitectura frontend

El código está organizado por responsabilidad y funcionalidad:

```text
src/
├── components/
│   └── shared/          # Componentes reutilizables de interfaz
├── data/                # Datos ficticios y configuración de navegación
├── pages/
│   ├── agenda/
│   ├── consultations/
│   ├── dashboard/
│   ├── documents/
│   ├── patients/
│   └── settings/
├── types/               # Tipos y contratos del frontend
├── utils/               # Formateadores y funciones auxiliares
├── App.tsx              # Composición general, estado de demo y modales
├── main.tsx             # Punto de entrada de React
└── styles.css           # Estilos globales de la demo
```

### Convenciones

- Cada pantalla vive en su carpeta dentro de `pages/`.
- Los elementos compartidos viven en `components/shared/`.
- Los tipos no se duplican entre páginas: se importan desde `types/`.
- Los datos de ejemplo se centralizan en `data/mockData.ts`.
- Las funciones auxiliares sin interfaz se ubican en `utils/`.
- Los componentes de página reciben datos y callbacks por props; no acceden a datos globales.
- `App.tsx` coordina la navegación y los flujos de demostración. No contiene la implementación interna de cada pantalla.

## Funcionalidades incluidas

- Navegación: Inicio, Agenda, Pacientes, Consultas, Documentos y Configuración.
- Selector de profesional/especialidad con registros ficticios independientes.
- Panel de inicio y agenda diaria.
- Alta y búsqueda de pacientes.
- Ficha de paciente, antecedentes e historia clínica.
- Consultas con borradores, vista previa y finalización.
- Evoluciones finalizadas en modo lectura y rectificaciones de demostración.
- Diseño adaptable a escritorio y móvil.

## Límites importantes

Esta entrega es exclusivamente una demostración frontend:

- Los datos son ficticios.
- Los cambios viven en el estado de la aplicación y se pierden al recargar.
- No hay autenticación real ni autorización en servidor.
- No hay API, PostgreSQL ni almacenamiento de archivos.
- Algunas acciones de configuración y documentos muestran mensajes informativos porque requieren backend.
- No utilizar para registrar ni tratar información real de pacientes.

La separación real de datos entre profesionales, auditoría, protección de archivos, persistencia y controles de seguridad deben implementarse y probarse en backend antes de cualquier uso clínico.

## Documentación funcional

Consultar `docs/requerimientos.md`, `docs/decisiones.md`, `docs/pantallas.md` y `docs/modelo-datos.md`.
