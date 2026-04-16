import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#1D4ED8]/15" style={{ background: "#0D1526" }}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 bg-[#1D4ED8] rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-black text-xs">CB</span>
              </div>
              <span className="text-lg font-black text-gradient">CineBox</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Sua plataforma de filmes favorita. Explore, descubra e assista os melhores títulos do cinema.
            </p>
            <p className="text-slate-700 text-xs">
              Dados fornecidos por{" "}
              <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-[#60A5FA] hover:underline">
                TMDB API
              </a>
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Navegação</h4>
              <ul className="space-y-2.5">
                {[["Início", "/"], ["Catálogo", "/catalogo"], ["Planos", "/planos"]].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-slate-500 hover:text-[#60A5FA] text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Conta</h4>
              <ul className="space-y-2.5">
                {[["Login", "/login"], ["Cadastro", "/cadastro"]].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-slate-500 hover:text-[#60A5FA] text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Categorias</h4>
            <div className="flex flex-wrap gap-2">
              {["Ação", "Terror", "Suspense", "Crime", "Ficção Científica", "Comédia", "Drama", "Animação"].map((cat) => (
                <Link
                  key={cat}
                  to="/catalogo"
                  className="px-3 py-1 glass rounded-full text-slate-400 hover:text-[#60A5FA] text-xs transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1D4ED8]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs">© 2026 CineBox. Todos os direitos reservados.</p>
          <p className="text-slate-700 text-xs">Projeto acadêmico — FACEF 2026</p>
        </div>
      </div>
    </footer>
  );
}
