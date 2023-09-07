import { indexHTML } from "../html/index.js";

const root = async function (fastify, opts) {
  fastify.addHook("preHandler", (request, reply, done) => {
    if (request.isAuthenticated()) {
      return done();
    }
    if (request.session.authenticated) {
      return done();
    }

    return reply.redirect("/auth/login");
  });
  fastify.get("/", (req, reply) => {
    const user = req.user || req.session.user;
    if (!user) {
      throw new Error("No users");
    }
    reply.type("text/html");
    return indexHTML(user);
  });
};

export default root;
