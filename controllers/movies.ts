import { Movie } from "../types.ts";

let movies: Movie[] = [
  { id: "1", name: "Movie one", description: "This is movie one", rating: 9 },
  { id: "2", name: "Movie two", description: "This is movie two", rating: 5 },
];

//@desc Get all movies
//@route GET /api/v1/movies
const getMovies = ({ response }: { response: any }) => {
  response.body = {
    success: true,
    data: movies,
  };
};

//@desc Get a movie
//@route GET /api/v1/movies/:id
const getMovie = ({ response }: { response: any }) => {
  response.body = "Get movie";
};

//@desc Add a movie
//@route POST /api/v1/movie
const addMovie = ({ response }: { response: any }) => {
  response.body = "Add movie";
};

//@desc Add a movie
//@route POST /api/v1/movie
const updateMovie = ({ response }: { response: any }) => {
  response.body = "Update movie";
};

//@desc Add a movie
//@route POST /api/v1/movie
const deleteMovie = ({ response }: { response: any }) => {
  response.body = "delete movie";
};

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };
