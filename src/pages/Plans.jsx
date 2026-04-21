import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

const PLANS = [
  {
    id: "basic",
    name: "Básico",
    price: "18,90",
    quality: "HD",
    screens: 1,
    downloads: false,
    borderColor: "#64748B",
    features: [
      "Acesso ao catálogo completo",
      "Qualidade HD (720p)",
      "1 tela simultânea",
      "Suporte padrão",
    ],
  },
  {
    id: "standard",
    name: "Padrão",
    price: "28,90",
    quality: "Full HD",
    screens: 2,
    downloads: true,
    badge: "Mais Popular",
    highlight: true,
    borderColor: "#3B82F6",
    features: [
      "Acesso ao catálogo completo",
      "Qualidade Full HD (1080p)",
      "2 telas simultâneas",
      "Downloads offline",
      "Suporte prioritário",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "39,90",
    quality: "4K Ultra HD",
    screens: 4,
    downloads: true,
    badge: "Premium",
    borderColor: "#F59E0B",
    features: [
      "Acesso ao catálogo completo",
      "Qualidade 4K Ultra HD",
      "4 telas simultâneas",
      "Downloads offline ilimitados",
      "Lançamentos antecipados",
      "Suporte prioritário 24h",
    ],
  },
];

// Todas as features unificadas — cada plano indica quais possui
// Features ordenadas por plano: presentes primeiro, ausentes depois
const FEATURES_BY_PLAN = {
  basic: [
    { label: "Acesso ao catálogo completo", ok: true },
    { label: "Qualidade HD (720p)",          ok: true },
    { label: "1 tela simultânea",           ok: true },
    { label: "Qualidade Full HD (1080p)",    ok: false },
    { label: "Qualidade 4K Ultra HD",        ok: false },
    { label: "2 ou mais telas simultâneas",  ok: false },
    { label: "Downloads offline",            ok: false },
    { label: "Suporte prioritário 24h",      ok: false },
    { label: "Lançamentos antecipados",      ok: false },
  ],
  standard: [
    { label: "Acesso ao catálogo completo", ok: true },
    { label: "Qualidade HD (720p)",          ok: true },
    { label: "Qualidade Full HD (1080p)",    ok: true },
    { label: "2 telas simultâneas",         ok: true },
    { label: "Downloads offline",            ok: true },
    { label: "Suporte prioritário 24h",      ok: true },
    { label: "Qualidade 4K Ultra HD",        ok: false },
    { label: "4 telas simultâneas",         ok: false },
    { label: "Lançamentos antecipados",      ok: false },
  ],
  premium: [
    { label: "Acesso ao catálogo completo", ok: true },
    { label: "Qualidade HD (720p)",          ok: true },
    { label: "Qualidade Full HD (1080p)",    ok: true },
    { label: "Qualidade 4K Ultra HD",        ok: true },
    { label: "4 telas simultâneas",         ok: true },
    { label: "Downloads offline",            ok: true },
    { label: "Suporte prioritário 24h",      ok: true },
    { label: "Lançamentos antecipados",      ok: true },
    { label: "",                             ok: true }, // padding para igualar altura
  ],
};

const PLAN_ORDER = { basic: 0, standard: 1, premium: 2 };

const COMPARISON = [
  { label: "Qualidade de vídeo",       values: ["HD", "Full HD", "4K Ultra HD"] },
  { label: "Telas simultâneas",        values: ["1", "2", "4"] },
  { label: "Downloads offline",        values: ["✗", "✓", "✓"] },
  { label: "Lançamentos antecipados",  values: ["✗", "✗", "✓"] },
  { label: "Catálogo completo",        values: ["✓", "✓", "✓"] },
];

const WHY_ITEMS = [
  { color: "#1D4ED8", title: "Catálogo Completo", desc: "Milhares de filmes e séries dos maiores estúdios do mundo, sempre atualizados.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg> },
  { color: "#F59E0B", title: "Qualidade de Imagem", desc: "Assista em HD, Full HD ou 4K Ultra HD dependendo do seu plano e dispositivo.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { color: "#3B82F6", title: "Múltiplos Dispositivos", desc: "TV, celular, tablet ou computador — assista onde e como quiser.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/></svg> },
  { color: "#22C55E", title: "Downloads Offline", desc: "Baixe seus filmes favoritos e assista sem internet nos planos Padrão e Premium.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
  { color: "#EF4444", title: "Sem Fidelidade", desc: "Cancele quando quiser, sem multas ou taxas de cancelamento.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg> },
  { color: "#F59E0B", title: "Lançamentos em Primeira Mão", desc: "No plano Premium, acesse os lançamentos antes de todo mundo.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
];

export default function Plans() {
  const { user, updatePlan } = useContext(AuthContext);
  const [confirm, setConfirm] = useState(null); // plano a confirmar
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const currentOrder = PLAN_ORDER[user?.plan] ?? -1;

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChoose = (plan) => {
    if (!user) { navigate("/cadastro"); return; }
    if (plan.id === user.plan) return;
    setConfirm(plan);
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    setUpdating(confirm.id);
    setConfirm(null);
    const result = await updatePlan(confirm.id);
    setUpdating(null);
    if (result.ok) showToast(`Plano alterado para ${confirm.name} com sucesso!`, true);
    else showToast(result.error, false);
  };

  const currentPlan = PLANS.find((p) => p.id === user?.plan);

  return (
    <div className="min-h-screen bg-[#060B18]">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all"
          style={{
              background: toast.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              border: toast.ok ? "1px solid #22C55E" : "1px solid #EF4444",
              color: toast.ok ? "#22C55E" : "#EF4444",
            }}
        >
          {toast.ok ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Modal de confirmação */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "#0F1C35", border: "1px solid #1e293b" }}>
            <h3 className="text-white font-bold text-lg mb-2">Confirmar mudança de plano</h3>
            <p className="text-slate-400 text-sm mb-6">
              Deseja alterar para o plano <span className="text-white font-semibold">{confirm.name}</span> por{" "}
              <span className="text-white font-semibold">R$ {confirm.price}/mês</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
                style={{ border: "1px solid #334155" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: "#1D4ED8", boxShadow: "0 0 16px rgba(29,78,216,0.4)" }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-28 pb-10 px-6 md:px-12" style={{ background: "linear-gradient(135deg, #0D1B3E, #0A0E1A)" }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Planos CineBox</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Entretenimento ilimitado a partir de R$ 18,90/mês.<br />Cancele quando quiser.
          </p>

          {/* Banner plano atual */}
          {user && currentPlan && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl max-w-md" style={{ background: "rgba(29,78,216,0.12)", border: "1px solid rgba(29,78,216,0.4)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div className="flex-1">
                <p className="text-slate-500 text-xs">Seu plano atual</p>
                <p className="text-white font-bold text-base">{currentPlan.name}</p>
              </div>
              <span className="text-[#60A5FA] text-sm font-semibold">R$ {currentPlan.price}/mês</span>
            </div>
          )}
        </div>
      </div>

      {/* Por que assinar */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <h2 className="text-xl font-bold text-white mb-1">Por que assinar o CineBox?</h2>
        <p className="text-slate-500 text-sm mb-6">Tudo que você precisa em um só lugar</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="p-4 rounded-xl transition-all" style={{ background: "#0F1C35", border: `1px solid ${item.color}20` }}>
              <div className="mb-2" style={{ color: item.color }}>{item.icon}</div>
              <p className="text-white text-sm font-bold mb-1">{item.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cards de planos */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
        <h2 className="text-xl font-bold text-white mb-1">Escolha seu Plano</h2>
        <p className="text-slate-500 text-sm mb-6">Todos os planos incluem acesso ao catálogo completo</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrent = user?.plan === plan.id;
            const planOrd = PLAN_ORDER[plan.id];
            const isUpgrade = planOrd > currentOrder;
            const isUpdating = updating === plan.id;
            const isPremium = plan.id === "premium";

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${plan.highlight ? "md:-mt-4 md:mb-4" : ""}`}
                style={{
                  background: isCurrent
                    ? "linear-gradient(135deg, rgba(29,78,216,0.12), #0F1C35)"
                    : isPremium
                    ? "linear-gradient(135deg, rgba(245,158,11,0.08), #0F1C35)"
                    : "#0F1C35",
                  border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? plan.borderColor : plan.highlight ? plan.borderColor + "60" : "#1e293b"}`,
                  boxShadow: isCurrent ? `0 0 24px ${plan.borderColor}25` : "none",
                }}
              >
                {/* Topo colorido com badge */}
                <div className="py-2 text-center text-xs font-semibold" style={{ background: `${plan.borderColor}18`, color: plan.borderColor }}>
                  {plan.badge || plan.name}
                </div>

                <div className="p-6">
                  {/* Nome, qualidade e preço */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white text-xl font-bold">{plan.name}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(29,78,216,0.2)", color: "#60A5FA" }}>
                            Atual
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: `${plan.borderColor}20`, color: plan.borderColor }}>
                        {plan.quality}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-2xl font-black">R$ {plan.price}</span>
                      <span className="text-slate-500 text-xs block">/mês</span>
                    </div>
                  </div>

                  {/* Destaques rápidos */}
                  <div className="flex gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid #1e293b" }}>
                    {[
                      { label: `${plan.screens} ${plan.screens === 1 ? "tela" : "telas"}` },
                      { label: plan.quality },
                      { label: plan.downloads ? "Downloads" : "Sem download", dim: !plan.downloads },
                    ].map((h) => (
                      <span key={h.label} className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: h.dim ? "rgba(100,116,139,0.1)" : `${plan.borderColor}15`, color: h.dim ? "#475569" : plan.borderColor }}>
                        {h.label}
                      </span>
                    ))}
                  </div>

                  {/* Features com riscado, presentes sempre acima */}
                  <ul className="space-y-2 mb-5">
                    {(FEATURES_BY_PLAN[plan.id] || []).filter(f => f.label).map((f) => (
                      <li key={f.label} className="flex items-center gap-2 text-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.ok ? plan.borderColor : "#334155"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                          {f.ok
                            ? <polyline points="20 6 9 17 4 12"/>
                            : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                          }
                        </svg>
                        <span style={{ color: f.ok ? "#CBD5E1" : "#334155", textDecoration: f.ok ? "none" : "line-through" }}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Botão */}
                  {!isCurrent && (
                    <button
                      onClick={() => handleChoose(plan)}
                      disabled={isUpdating}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all relative overflow-hidden group/btn"
                      style={{
                        background: isUpgrade || !user ? "#1D4ED8" : "#1e293b",
                        border: isUpgrade || !user ? "none" : "1px solid #334155",
                        boxShadow: isUpgrade || !user ? "0 0 16px rgba(29,78,216,0.35)" : "none",
                      }}
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        <>
                          {!user ? "Começar agora" : isUpgrade ? "Fazer Upgrade" : "Fazer Downgrade"}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </>
                      )}
                    </button>
                  )}

                  {isCurrent && (
                    <div className="w-full py-3 rounded-xl text-sm font-semibold text-center" style={{ background: "rgba(29,78,216,0.1)", color: "#60A5FA", border: "1px solid rgba(29,78,216,0.3)" }}>
                      ✓ Plano atual
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela comparativa */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-16">
        <div className="rounded-2xl p-6" style={{ background: "#0F1C35", border: "1px solid #1e293b" }}>
          <h2 className="text-white font-bold text-lg mb-5">Comparativo de Planos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1e293b" }}>
                  <th className="text-left text-slate-500 font-medium pb-3 text-xs">Recurso</th>
                  {[["Básico", "#64748B"], ["Padrão", "#3B82F6"], ["Premium", "#F59E0B"]].map(([name, color]) => (
                    <th key={name} className="text-center pb-3 text-xs font-bold" style={{ color }}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td className="py-3 text-slate-400 text-xs">{row.label}</td>
                    {row.values.map((v, i) => {
                      const isCheck = v === "✓";
                      const isCross = v === "✗";
                      return (
                        <td key={i} className="py-3 text-center">
                          {isCheck ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: "rgba(34,197,94,0.15)" }}>
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1.5,6 4.5,9 10.5,3"/>
                              </svg>
                            </span>
                          ) : isCross ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: "rgba(239,68,68,0.12)" }}>
                              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                                <line x1="2" y1="2" x2="8" y2="8"/>
                                <line x1="8" y1="2" x2="2" y2="8"/>
                              </svg>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold" style={{ color: "#E2E8F0" }}>{v}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
