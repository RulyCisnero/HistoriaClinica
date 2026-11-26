import { useState, type FormEvent } from "react";
import { ArrowRight, HeartPulse, LockKeyhole, ShieldCheck, Stethoscope } from "lucide-react";
import type { Specialty } from "../../types";

const demoAccounts: {
  specialty: Specialty;
  name: string;
  role: string;
  initials: string;
  tone: string;
  accessCode: string;
}[] = [
  {
    specialty: "Urología",
    name: "Dr. Martín López",
    role: "Especialista en Urología",
    initials: "ML",
    tone: "blue",
    accessCode: "DEMO2026",
  },
  {
    specialty: "Reumatología",
    name: "Dra. Laura Méndez",
    role: "Especialista en Reumatología",
    initials: "LM",
    tone: "violet",
    accessCode: "DEMO2026",
  },
];

export function LoginPage({
  onLogin,
}: {
  onLogin: (specialty: Specialty) => void;
}) {
  const [selected, setSelected] = useState<Specialty>("Urología");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  const account = demoAccounts.find((item) => item.specialty === selected)!;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (accessCode.trim() !== account.accessCode) {
      setError("La clave ingresada no es correcta.");
      return;
    }
    setError("");
    onLogin(account.specialty);
  };

  return (
    <main className="login-screen">
      <section className="login-card">
        <div className="login-brand">
          <div className="brand-mark"><HeartPulse size={24} /></div>
          <div><strong>clínica</strong><span>HISTORIA DIGITAL</span></div>
        </div>

        <div className="login-intro">
          <span className="login-eyebrow">CONSULTORIO MÉDICO</span>
          <h1>Bienvenido</h1>
          <p>Ingresá al espacio profesional para gestionar tu agenda e historias clínicas.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label className="login-label">Seleccioná tu perfil profesional</label>
          <div className="login-professionals">
            {demoAccounts.map((item) => (
              <button
                type="button"
                key={item.specialty}
                className={`login-professional ${selected === item.specialty ? "selected" : ""}`}
                onClick={() => {
                  setSelected(item.specialty);
                  setAccessCode("");
                  setError("");
                }}
                aria-pressed={selected === item.specialty}
              >
                <span className={`avatar ${item.tone}`}>{item.initials}</span>
                <span className="login-professional-copy">
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </span>
                <span className="login-radio" />
              </button>
            ))}
          </div>

          <label className="login-label" htmlFor="access-code">Clave de acceso de demostración</label>
          <div className="login-input-wrap">
            <LockKeyhole size={17} />
            <input
              id="access-code"
              type="password"
              autoComplete="current-password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="Ingresá tu clave"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}

          <button className="btn primary login-submit" type="submit">
            Ingresar al consultorio <ArrowRight size={17} />
          </button>
        </form>

        <div className="login-security-note">
          <ShieldCheck size={17} />
          <span><strong>Acceso por profesional</strong> Cada cuenta visualiza únicamente los datos de su especialidad en esta demostración.</span>
        </div>
        <div className="login-demo-hint">
          <Stethoscope size={14} /> Clave de prueba: <strong>DEMO2026</strong>
        </div>
      </section>
      <p className="login-disclaimer">Versión de demostración · Datos ficticios · No utilizar para atención real</p>
    </main>
  );
}
