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
      "SELECT * FROM movies WHERE id = $1",
      params.id
    );

    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        success: false,
        msg: `No movie found with id of ${params.id}`,
      };
      return;
    } else {
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
    }
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
  await getMovie({ params: { id: params.id }, response });

  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      msg: response.body.msg,
    };
    return;
  } else {
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, msg: "No data" };
    } else {
      //Get request body values
      const body = await request.body();
      const movie = body.value;
      try {
        await client.connect();
        const result = await client.query(
          "UPDATE movies SET name=$2, description=$3, price=$4 WHERE id = $1",
          params.id,
          movie.name,
          movie.description,
          movie.price
        );
        response.body = {
          success: true,
          data: `Update successful for movie at id of ${params.id}`,
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
  }
};

//@desc Delete a movie
//@route DELETE /api/v1/movies/:id
const deleteMovie = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  await getMovie({ params: { id: params.id }, response });

  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      msg: response.body.msg,
    };
    return;
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "DELETE FROM movies WHERE id = $1",
        params.id
      );
      response.body = {
        success: true,
        data: `Deletion successful for movie at id of ${params.id}`,
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

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };
