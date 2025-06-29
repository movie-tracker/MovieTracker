import { Link } from "react-router-dom";
import { Film, Star, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const IntroPage = () => {
  const stats = [
    { icon: Film, label: "Filmes", value: "10,000+" },
    { icon: Users, label: "Usuários", value: "50,000+" },
    { icon: Star, label: "Avaliações", value: "1M+" },
    { icon: TrendingUp, label: "Trending", value: "Diário" }
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
          <Link to="/explore">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Explorar Filmes
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
            Sua biblioteca pessoal de cinema, sempre atualizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-lg px-8 py-6">
                Explorar Filmes Agora
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-semibold text-lg px-8 py-6">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para organizar seus filmes
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Recursos pensados para cinéfilos que querem ter controle total sobre sua experiência cinematográfica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Film className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Biblioteca Pessoal</h4>
              <p className="text-gray-400">
                Organize todos os filmes que você já assistiu, quer assistir ou está assistindo em listas personalizadas.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Avaliações & Reviews</h4>
              <p className="text-gray-400">
                Avalie filmes, escreva comentários e veja as avaliações da comunidade para descobrir novos favoritos.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Descoberta Inteligente</h4>
              <p className="text-gray-400">
                Receba recomendações personalizadas baseadas no seu histórico e preferências cinematográficas.
              </p>
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
            Junte-se a milhares de cinéfilos que já organizam seus filmes conosco
          </p>
          <Link to="/explore">
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-lg px-8 py-6">
              Explorar Filmes Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default IntroPage; 