import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PLANS = [
  {
    name: "Básico",
    price: "19,90",
    borderColor: "#334155",
    features: [
      { text: "Acesso a filmes populares", ok: true },
      { text: "Qualidade HD (720p)", ok: true },
      { text: "1 tela simultânea", ok: true },
      { text: "Catálogo básico", ok: true },
      { text: "Downloads offline", ok: false },
      { text: "Conteúdo exclusivo", ok: false },
      { text: "Qualidade 4K", ok: false },
    ],
  },
  {
    name: "Intermediário",
    price: "29,90",
    badge: "Mais Popular",
    highlight: true,
    borderColor: "#1D4ED8",
    features: [
      { text: "Acesso completo ao catálogo", ok: true },
      { text: "Qualidade Full HD (1080p)", ok: true },
      { text: "2 telas simultâneas", ok: true },
      { text: "Downloads offline", ok: true },
      { text: "Conteúdo exclusivo", ok: true },
      { text: "Qualidade 4K", ok: false },
      { text: "Lançamentos antecipados", ok: false },
    ],
  },
  {
    name: "Avançado",
    price: "49,90",
    badge: "Premium",
    borderColor: "#B45309",
    features: [
      { text: "Acesso completo ao catálogo", ok: true },
      { text: "Qualidade 4K Ultra HD", ok: true },
      { text: "4 telas simultâneas", ok: true },
      { text: "Downloads ilimitados", ok: true },
      { text: "Conteúdo exclusivo", ok: true },
      { text: "Lançamentos antecipados", ok: true },
      { text: "Suporte prioritário 24h", ok: true },
    ],
  },
];

// Ícones SVG únicos por plano
const PlanIcon = ({ name, active, borderColor }) => {
  const style = {
    background: active ? `${borderColor}20` : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? borderColor + "70" : "rgba(255,255,255,0.06)"}`,
  };

  if (name === "Básico") return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300" style={style}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#94A3B8" : "#475569"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    </div>
  );

  if (name === "Intermediário") return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300" style={style}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#60A5FA" : "#334155"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </div>
  );

  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300" style={style}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#F59E0B" : "#44403C"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>
      </svg>
    </div>
  );
};

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: "Pagamento 100% Seguro",
    desc: "Todas as transações são protegidas com criptografia SSL de ponta a ponta. Seus dados financeiros nunca são armazenados em nossos servidores.",
    color: "#22C55E",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Cancele Quando Quiser",
    desc: "Sem multas, sem burocracia. Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel da sua conta, com efeito imediato.",
    color: "#3B82F6",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="12" y2="17"/>
      </svg>
    ),
    title: "Sem Contrato de Fidelidade",
    desc: "Nenhum plano exige permanência mínima. Assine hoje, use pelo tempo que quiser e cancele sem nenhuma penalidade ou taxa de saída.",
    color: "#A855F7",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Suporte em Português",
    desc: "Nossa equipe de atendimento está disponível em português todos os dias. Planos Premium contam com suporte prioritário 24 horas por dia.",
    color: "#F59E0B",
  },
];

export default function Plans() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const handleChoose = (name) => {
    setSelected(name);
    setTimeout(() => navigate("/cadastro"), 700);
  };

  return (
    <div className="min-h-screen bg-[#060B18]">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-12 text-center px-6">
        <span className="inline-block px-4 py-1.5 bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 rounded-full text-[#60A5FA] text-xs font-semibold tracking-wider uppercase mb-4">
          Planos & Preços
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Escolha seu <span className="text-gradient">plano ideal</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Cancele quando quiser. Sem taxas ocultas. Comece hoje mesmo.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {PLANS.map((plan) => {
            const isActive = hovered === plan.name || selected === plan.name;
            const isPremium = plan.name === "Avançado";

            return (
              <div
                key={plan.name}
                onMouseEnter={() => setHovered(plan.name)}
                onMouseLeave={() => setHovered(null)}
                className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                  plan.highlight ? "md:-mt-6 md:mb-6" : ""
                } ${selected === plan.name ? "scale-95 opacity-60" : isActive ? "scale-[1.02]" : ""}`}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(135deg, rgba(29,78,216,0.15), rgba(15,28,53,0.95))"
                    : isPremium
                    ? "linear-gradient(135deg, rgba(180,83,9,0.1), rgba(15,28,53,0.95))"
                    : "#0F1C35",
                  border: `2px solid ${isActive ? plan.borderColor : plan.highlight ? plan.borderColor + "80" : isPremium ? plan.borderColor + "50" : "#1e293b"}`,
                  boxShadow: isActive ? `0 0 30px ${plan.borderColor}35` : "none",
                }}
              >
                {/* Badge — mesmo estilo para ambos, cor diferente */}
                {plan.badge && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{
                      background: plan.highlight ? "#1D4ED8" : "#B45309",
                      color: "#fff",
                      boxShadow: plan.highlight
                        ? "0 0 16px rgba(29,78,216,0.55)"
                        : "0 0 16px rgba(180,83,9,0.55)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Ícone SVG */}
                <PlanIcon name={plan.name} active={isActive} borderColor={plan.borderColor} />

                {/* Nome e preço */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <div className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="text-slate-400 text-sm">R$</span>
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-400 text-sm">/mês</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          background: f.ok ? `${plan.borderColor}25` : "rgba(100,116,139,0.08)",
                          color: f.ok
                            ? plan.highlight ? "#60A5FA" : isPremium ? "#F59E0B" : "#94A3B8"
                            : "#334155",
                        }}
                      >
                        {f.ok ? "✓" : "✕"}
                      </span>
                      <span className={f.ok ? "text-slate-300" : "text-slate-700"}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão */}
                <button
                  onClick={() => handleChoose(plan.name)}
                  disabled={selected === plan.name}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden group/btn"
                  style={{
                    background: plan.highlight
                      ? isActive ? "#1E40AF" : "#1D4ED8"
                      : isPremium
                      ? isActive ? "#92400E" : "#B45309"
                      : isActive ? `${plan.borderColor}18` : "transparent",
                    border: plan.highlight || isPremium ? "none" : `1.5px solid ${isActive ? plan.borderColor : "#1e293b"}`,
                    color: plan.highlight || isPremium ? "#fff" : isActive ? "#fff" : "#64748B",
                    boxShadow:
                      plan.highlight && isActive ? "0 0 20px rgba(29,78,216,0.45)"
                      : isPremium && isActive ? "0 0 20px rgba(180,83,9,0.45)"
                      : "none",
                  }}
                >
                  <span className="relative z-10">
                    {selected === plan.name ? "Redirecionando..." : "Começar agora"}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção Por que confiar */}
      <div className="max-w-6xl mx-auto px-6 pb-20 mt-16">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#1D4ED8]/15 border border-[#1D4ED8]/25 rounded-full text-[#60A5FA] text-xs font-semibold tracking-wider uppercase mb-4">
            Transparência total
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Por que confiar no <span className="text-gradient">CineBox?</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
            Construímos nossa plataforma com base em quatro pilares que colocam você sempre em primeiro lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: "#0F1C35",
                border: "1px solid #1e293b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = `1px solid ${item.color}35`;
                e.currentTarget.style.boxShadow = `0 0 25px ${item.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid #1e293b";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
