import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const PLANS = [
  { value: "basico", label: "Básico", price: "R$ 19,90/mês", desc: "HD · 1 tela" },
  { value: "intermediario", label: "Intermediário", price: "R$ 29,90/mês", desc: "Full HD · 2 telas" },
  { value: "avancado", label: "Avançado", price: "R$ 49,90/mês", desc: "4K · 4 telas" },
];

export default function Register() {
  const { register, loginWithGoogle, getGoogleProfile } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", plan: "" });
  const [googleMode, setGoogleMode] = useState(false); // true = campos preenchidos pelo Google
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Pré-preenche com dados do Google sem logar
  const handleGoogleFill = async () => {
    setGoogleLoading(true);
    setError("");
    const result = await getGoogleProfile();
    setGoogleLoading(false);
    if (!result.ok) {
      if (result.error) setError(result.error);
      return;
    }
    setForm((f) => ({ ...f, name: result.name, email: result.email, password: "" }));
    setGoogleMode(true);
  };

  // Cancela o modo Google e limpa os campos
  const cancelGoogle = () => {
    setForm({ name: "", email: "", password: "", plan: "" });
    setGoogleMode(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plan) return setError("Selecione um plano para continuar.");

    setError("");
    setLoading(true);

    // Se veio do Google, usa loginWithGoogle definitivo (já tem conta criada no Firebase)
    if (googleMode) {
      const result = await loginWithGoogle();
      if (!result.ok && result.error) { setLoading(false); return setError(result.error); }
      navigate("/");
      return;
    }

    // Cadastro normal por email/senha
    if (!form.name || !form.email || !form.password)
      return setError("Preencha todos os campos.");
    if (form.password.length < 6)
      return setError("A senha deve ter pelo menos 6 caracteres.");

    const result = await register(form.email, form.password, form.name);
    if (!result.ok) { setLoading(false); return setError(result.error); }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#060B18] relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(29,78,216,0.15) 0%, transparent 70%)" }} />

      <div className="flex items-center justify-center min-h-screen px-4 py-8 pt-24">
        <div className="w-full max-w-md relative z-10">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Criar conta</h2>
            <p className="text-slate-500 text-sm mb-6">Crie sua conta e comece a assistir</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nome */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={set("name")}
                  readOnly={googleMode}
                  className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#1D4ED8] transition-all text-sm"
                  style={googleMode ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={set("email")}
                  readOnly={googleMode}
                  className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#1D4ED8] transition-all text-sm"
                  style={googleMode ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                />
              </div>

              {/* Senha — oculta no modo Google */}
              {!googleMode && (
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Senha</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={set("password")}
                    className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#1D4ED8] transition-all text-sm"
                  />
                </div>
              )}

              {/* Badge Google ativo */}
              {googleMode && (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#111827] border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <GoogleIcon />
                    <span>Dados preenchidos via Google</span>
                  </div>
                  <button type="button" onClick={cancelGoogle} className="text-slate-600 hover:text-slate-400 text-xs underline transition-colors">
                    Cancelar
                  </button>
                </div>
              )}

              {/* Plano */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-2 block">
                  Plano escolhido <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map((p) => {
                    const active = form.plan === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, plan: p.value }))}
                        className="relative flex flex-col items-center text-center px-2 py-3 rounded-xl border transition-all duration-200"
                        style={{
                          background: active ? "rgba(29,78,216,0.15)" : "#111827",
                          borderColor: active ? "#1D4ED8" : "#334155",
                          boxShadow: active ? "0 0 12px rgba(29,78,216,0.3)" : "none",
                        }}
                      >
                        {active && (
                          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#1D4ED8] rounded-full flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        )}
                        <span className={`text-xs font-semibold mb-0.5 ${active ? "text-white" : "text-slate-300"}`}>{p.label}</span>
                        <span className={`text-xs font-bold ${active ? "text-[#60A5FA]" : "text-slate-400"}`}>{p.price}</span>
                        <span className="text-slate-600 text-xs mt-0.5">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
                <Link to="/planos" className="text-[#60A5FA] text-xs mt-2 inline-block hover:underline">
                  Ver detalhes dos planos →
                </Link>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ boxShadow: "0 0 20px rgba(29,78,216,0.35)" }}
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Já tem conta?{" "}
              <Link to="/login" className="text-[#60A5FA] hover:text-[#3B82F6] font-medium transition-colors">
                Entrar
              </Link>
            </p>

            {/* Divisor */}
            {!googleMode && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-slate-600 text-xs">ou preencha com</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleFill}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 bg-[#111827] hover:bg-[#1a2332] hover:border-slate-600 transition-all text-sm font-medium text-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Preencher com Google
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
