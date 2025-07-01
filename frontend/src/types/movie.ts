export interface Movie {
  id: number;
  title: string;
  year: number;
  poster_path: string;
  userRating: number;
  imdbRating: number;
  watched: boolean;
}

export interface Stats {
  total: number;
  watched: number;
  toWatch: number;
}

export interface MovieDTO {
  id: number;
  title: string;
  poster_path: string;
  background_path: string;
  year: string;
  description: string;
  genre: string[];
  duration: string;
  tmdb_id?: number;
  tagline?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  status?: string;
  release_date?: string;
  original_title?: string;
  original_language?: string;
  homepage?: string;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  runtime?: number;
  production_companies?: any[];
  production_countries?: any[];
  spoken_languages?: any[];
}

export type WatchListStatus = 'unwatched' | 'watching' | 'plan to watch' | 'watched';

export interface WatchListDTO {
  id: number;
  movie_id: number;
  user_id: number;
  status: WatchListStatus;
  favorite: boolean;
  comments?: string;
  rating?: number;
}

export interface WatchListCreateDTO {
  movie_id: number;
  status?: WatchListStatus;
  favorite?: boolean;
  comments?: string | null;
  rating?: number | null;
}

export interface UpdateStatusRequestDTO {
  status: WatchListStatus;
}

export interface ToggleFavoriteRequestDTO {
  favorite: boolean;
}

export interface UpdateRatingRequestDTO {
  rating?: number;
}

export interface UpdateWatchlistRequestDTO {
  status?: WatchListStatus;
  favorite?: boolean | null;
  comments?: string | null;
  rating?: number | null;
}
