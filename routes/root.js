import { indexHTML } from "../html/index.js";

const root = async function (fastify, opts) {
  fastify.addHook("preHandler", (request, reply, done) => {
    if (!request.isAuthenticated()) {
      return reply.redirect("/auth/passport");
    }
    done();
  });
  fastify.get("/", (req, reply) => {
    reply.type("text/html");
    return indexHTML(req.user);
  });
};

export default root;
