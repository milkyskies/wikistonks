import { createMiddleware } from "hono/factory";
import type { UserRepository } from "../../domain/repositories/user-repository";
import { makeDatabase } from "../../infrastructure/db/database";
import { makeUserRepository } from "../../infrastructure/db/user-repository";
import type { Bindings } from "../../infrastructure/env";

export type RepositoryVariables = {
	userRepository: UserRepository;
};

export const repositoriesMiddleware = createMiddleware<{
	Bindings: Bindings;
	Variables: RepositoryVariables;
}>(async (context, next) => {
	const db = makeDatabase(context.env);
	context.set("userRepository", makeUserRepository(db));
	await next();
});
