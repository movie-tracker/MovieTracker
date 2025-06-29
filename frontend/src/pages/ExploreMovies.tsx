import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MovieCard from "@/components/MovieCard";
import { MovieDTO } from "@/types/movie";
import { movieService } from "@/services/movieService";

const ExploreMovies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const { data, isLoading, error } = useQuery<MovieDTO[]>({
    queryKey: ['movies'],
    queryFn: movieService.getMovies,
  });

  // Garante que sempre será um array
  const movies = Array.isArray(data) ? data : [];

  const filteredMovies = movies.filter((movie: MovieDTO) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || movie.genre.some((g: string) => g.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(new Set(movies.flatMap((movie: MovieDTO) => movie.genre)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando filmes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar filmes. Tente novamente.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Explorar Filmes
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar filmes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 w-64"
                />
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-yellow-400 focus:outline-none"
              >
                <option value="">Todos os gêneros</option>
                {genres.map((genre: string) => (
                  <option key={genre} value={genre} className="bg-slate-800">
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Filmes Disponíveis
          </h2>
          <p className="text-gray-300">
            {filteredMovies.length} filme{filteredMovies.length !== 1 ? 's' : ''} encontrado{filteredMovies.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie: MovieDTO) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">Nenhum filme encontrado</div>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreMovies; 