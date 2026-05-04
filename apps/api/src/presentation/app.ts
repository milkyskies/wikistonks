import { Hono } from "hono";
import type { Bindings } from "../infrastructure/env";
import { errorHandler } from "./error-handler";
import type { AuthVariables } from "./middleware/auth";
import { corsMiddleware } from "./middleware/cors";
import {
	type RepositoryVariables,
	repositoriesMiddleware,
} from "./middleware/repositories";
import type { RequireUserVariables } from "./middleware/require-user";
import { meRoutes } from "./routes/me-routes";

export const app = new Hono<{
	Bindings: Bindings;
	Variables: RepositoryVariables & AuthVariables & RequireUserVariables;
}>()
	.use("*", corsMiddleware)
	.use("*", repositoriesMiddleware)
	.onError(errorHandler)
	.route("/", meRoutes);
