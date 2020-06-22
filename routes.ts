import { Router } from "https://deno.land/x/oak/mod.ts";
import { getMovies } from "./controllers/movies.ts";
const router = new Router();

router.get("/api/v1/movies", getMovies);

export default router;
