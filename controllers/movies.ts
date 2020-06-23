import { v4 } from "https://deno.land/std/uuid/mod.ts";
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
const getMovie = ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  const movie: Movie | undefined = movies.find((m) => m.id == params.id);
  if (movie) {
    response.status = 200;
    response.body = {
      success: true,
      data: movie,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No movie found",
    };
  }
};

//@desc Add a movie
//@route POST /api/v1/movies
const addMovie = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else {
    const movie = body.value;
    movie.id = v4.generate();
    movies.push(movie);
    console.log("Fired add 2");
    response.status = 201;
    response.body = {
      success: true,
      data: movie,
    };
  }
};

//@desc Update a movie
//@route PUT /api/v1/movies/:id
const updateMovie = ({ response }: { response: any }) => {
  response.body = "Update movie";
};

//@desc Delete a movie
//@route DELETE /api/v1/movies/:id
const deleteMovie = ({ response }: { response: any }) => {
  response.body = "delete movie";
};

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };
