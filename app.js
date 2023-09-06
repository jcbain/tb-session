import path from "path";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import { Authenticator } from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";

import { db } from "./db.js";
import { processLocalResponse } from "./routes/auth/helpers/strategies.js";
import authRoutes from "./routes/auth/index.js";
import rootRoutes from "./routes/root.js";
import { envLogger } from "./configs/logger.js";

const PORT = process.env.PORT || 4000;
const environment = process.env.NODE_ENV;
const dev = environment !== "production";
const __dirname = path.resolve();

const run = async function (opts) {
  const fastify = await Fastify(opts);
  const fastifyPassport = new Authenticator();

  fastify.decorate("db", db);
  fastify.decorate("fastifyPassport", fastifyPassport);
  fastify.decorateRequest("authenticated", false);

  if (dev) {
    fastify.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
      prefix: "/assets/",
    });
  }

  // plugins
  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    secret: "somesuperlongcharacterstringofunknonwlength",
    cookie: { secure: false },
  });
  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    "local",
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      processLocalResponse(db)
    )
  );
  fastifyPassport.registerUserSerializer(async (user) => {
    return user.id;
  });

  fastifyPassport.registerUserDeserializer(async (id) => {
    const foundUser = db.users.find((user) => {
      return user.id === id;
    });
    return foundUser;
  });

  fastify.register(rootRoutes, { prefix: "/" });
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.listen({ port: PORT });
};

try {
  await run({ logger: envLogger[environment] || true });
} catch (err) {
  console.error(err);
}
