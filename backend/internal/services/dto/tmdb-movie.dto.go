package dto

type TMDBMovieDTO struct {
	Adult               bool                `json:"adult"`
	BackdropPath        *string             `json:"backdrop_path"`
	BelongsToCollection interface{}         `json:"belongs_to_collection"`
	Budget              int                 `json:"budget"`
	Genres              []GenreDTO          `json:"genres"`
	Homepage            string              `json:"homepage"`
	ID                  int                 `json:"id"`
	ImdbID              *string             `json:"imdb_id"`
	OriginCountry       []string            `json:"origin_country"`
	OriginalLanguage    string              `json:"original_language"`
	OriginalTitle       string              `json:"original_title"`
	Overview            string              `json:"overview"`
	Popularity          float64             `json:"popularity"`
	PosterPath          string              `json:"poster_path"`
	ProductionCompanies []CompanyDTO        `json:"production_companies"`
	ProductionCountries []CountryDTO        `json:"production_countries"`
	ReleaseDate         string              `json:"release_date"`
	Revenue             int                 `json:"revenue"`
	Runtime             int                 `json:"runtime"`
	SpokenLanguages     []SpokenLanguageDTO `json:"spoken_languages"`
	Status              string              `json:"status"`
	Tagline             string              `json:"tagline"`
	Title               string              `json:"title"`
	Video               bool                `json:"video"`
	VoteAverage         float64             `json:"vote_average"`
	VoteCount           int                 `json:"vote_count"`
	Translations        *TranslationsDTO    `json:"translations,omitempty"`
}

type GenreDTO struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CompanyDTO struct {
	ID            int     `json:"id"`
	LogoPath      *string `json:"logo_path"`
	Name          string  `json:"name"`
	OriginCountry string  `json:"origin_country"`
}

type CountryDTO struct {
	ISO31661 string `json:"iso_3166_1"`
	Name     string `json:"name"`
}

type SpokenLanguageDTO struct {
	EnglishName string `json:"english_name"`
	ISO6391     string `json:"iso_639_1"`
	Name        string `json:"name"`
}

type TranslationsDTO struct {
	Translations []TranslationDTO `json:"translations"`
}

type TranslationDTO struct {
	ISO31661    string             `json:"iso_3166_1"`
	ISO6391     string             `json:"iso_639_1"`
	Name        string             `json:"name"`
	EnglishName string             `json:"english_name"`
	Data        TranslationDataDTO `json:"data"`
}

type TranslationDataDTO struct {
	Title    string `json:"title"`
	Overview string `json:"overview"`
	Tagline  string `json:"tagline"`
}
