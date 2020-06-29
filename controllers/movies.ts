import { Client } from "https://deno.land/x/postgres/mod.ts";
import { dbCreds } from "../config.ts";
import { Movie } from "../types.ts";

const client = new Client(dbCreds);
let movies: Movie[] = [];

//@desc Get all movies
//@route GET /api/v1/movies
const getMovies = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    const result = await client.query("SELECT * FROM movies");
    const movies = new Array();
    result.rows.map((m) => {
      let obj: any = new Object();
      result.rowDescription.columns.map((el, index) => {
        obj[el.name] = m[index];
      });
      movies.push(obj);
    });
    response.body = {
      success: true,
      data: movies,
    };
  } catch (err) {
    response.status = 500;
    response.body = {
      success: false,
      msg: err.toString(),
    };
  } finally {
    await client.end();
  }
};

//@desc Get a movie
//@route GET /api/v1/movies/:id
const getMovie = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    await client.connect();
    const result = await client.query(
      `SELECT * FROM movies WHERE id = ${params.id}`
    );
    let movie: any = new Object();
    result.rows.map((m) => {
      result.rowDescription.columns.map((el, index) => {
        movie[el.name] = m[index];
      });
    });
    response.body = {
      success: true,
      data: movie,
    };
  } catch (err) {
    response.status = 500;
    response.body = {
      success: false,
      msg: err.toString(),
    };
  } finally {
    await client.end();
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
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO movies(name,description,price) VALUES($1,$2,$3)",
        movie.name,
        movie.description,
        movie.price
      );
      response.body = {
        success: true,
        data: movie,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        success: false,
        msg: err.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

//@desc Update a movie
//@route PUT /api/v1/movies/:id
const updateMovie = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  const movie: Movie | undefined = movies.find((m) => m.id == params.id);
  if (movie) {
    const body = await request.body();
    const updateData: { name?: string; description?: string; rating?: number } =
      body.value;
    movies = movies.map((m) =>
      m.id === params.id ? { ...m, ...updateData } : m
    );
    response.status = 200;
    response.body = { success: true, data: movies };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No movie found",
    };
  }
};

//@desc Delete a movie
//@route DELETE /api/v1/movies/:id
const deleteMovie = ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  const filteredMovies: Movie[] | undefined = movies.filter(
    (m) => m.id !== params.id
  );
  if (filteredMovies.length !== movies.length) {
    movies = filteredMovies;
    response.status = 200;
    response.body = { success: true, data: movies };
  } else {
    response.status = 401;
    response.body = { success: false, data: "Movie id not found" };
  }
};

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };
