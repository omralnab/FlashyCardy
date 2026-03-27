import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { resolveDatabaseUrl } from "./resolve-database-url";

export const db = drizzle(resolveDatabaseUrl(), { schema });
