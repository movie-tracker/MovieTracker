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
