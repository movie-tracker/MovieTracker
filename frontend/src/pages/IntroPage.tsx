import { Link } from "react-router-dom";
import { Film, Star, Heart, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const IntroPage = () => {
  const features = [
    { 
      icon: Film, 
      title: "Catálogo de Filmes", 
      description: "Explore milhares de filmes populares do TMDB com informações detalhadas, posters e sinopses.",
      color: "text-blue-400"
    },
    { 
      icon: Star, 
      title: "Sistema de Status", 
      description: "Organize seus filmes com status: Quero Assistir, Assistindo, Assistido. Controle total da sua jornada cinematográfica.",
      color: "text-yellow-400"
    },
    { 
      icon: Heart, 
      title: "Favoritos", 
      description: "Marque seus filmes favoritos e crie uma lista personalizada dos seus títulos preferidos.",
      color: "text-red-400"
    },
    { 
      icon: Search, 
      title: "Busca Inteligente", 
      description: "Encontre filmes rapidamente com busca por título e filtros por status da sua watchlist.",
      color: "text-green-400"
    },
    { 
      icon: Plus, 
      title: "Avaliações & Comentários", 
      description: "Avalie filmes de 1 a 5 estrelas e adicione comentários pessoais para cada título.",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Movie Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Criar Conta
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            Sua plataforma de tracking de filmes
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Organize sua
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}jornada{" "}
            </span>
            cinematográfica
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubra, avalie e organize todos os filmes que você já assistiu ou quer assistir. 
            Sua biblioteca pessoal de cinema, sempre atualizada com dados do TMDB.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-lg px-8 py-6">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-semibold text-lg px-8 py-6">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Funcionalidades Disponíveis
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Recursos implementados para cinéfilos que querem organizar sua experiência cinematográfica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-yellow-400/50 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">{feature.title}</h4>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Types Section */}
      <section className="py-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Status de Watchlist
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Organize seus filmes com os status disponíveis na plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <Film className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">Quero Assistir</div>
              <div className="text-gray-400">Filmes que você planeja assistir</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                <Film className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">Assistindo</div>
              <div className="text-gray-400">Filmes que você está assistindo</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <Film className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">Assistido</div>
              <div className="text-gray-400">Filmes que você já assistiu</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                <Heart className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">Favoritos</div>
              <div className="text-gray-400">Seus filmes favoritos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Crie sua conta gratuita e comece a organizar seus filmes hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-lg px-8 py-6">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-semibold text-lg px-8 py-6">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroPage; 