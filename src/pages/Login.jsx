import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Preencha todos os campos.");
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) {
      setLoading(false);
      return setError(result.error);
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#060B18] relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(29,78,216,0.15) 0%, transparent 70%)" }} />

      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md relative z-10">

          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-1">Entrar na conta</h2>
            <p className="text-slate-500 text-sm mb-6">Bem-vindo de volta ao CineBox</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#1D4ED8] transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#1D4ED8] transition-all text-sm"
                />
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
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Não tem conta?{" "}
              <Link to="/cadastro" className="text-[#60A5FA] hover:text-[#3B82F6] font-medium transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
