export interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  userRating: number;
  imdbRating: number;
  watched: boolean;
}

export interface Stats {
  total: number;
  watched: number;
  toWatch: number;
}
