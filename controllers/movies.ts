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

export { getMovies };
