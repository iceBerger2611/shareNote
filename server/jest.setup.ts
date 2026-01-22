import path from "path";
import dotenv from "dotenv";

// Load test env *before* anything else imports PrismaClient
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// Safety guard: never allow tests to run against non-test DB
const url = process.env.DATABASE_URL ?? "";
if (!url.includes("sharenote_test")) {
  throw new Error(
    `Refusing to run tests: DATABASE_URL is not test DB. Got: ${url}`
  );
}
