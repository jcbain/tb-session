import fastifyFormbody from "@fastify/formbody";
import { signupHTML, passportLogin } from "../../html/index.js";

const auth = async function (fastify, opts) {
  fastify.register(fastifyFormbody);

  // render signup page
  fastify.get("/signup", (request, reply) => {
    reply.type("text/html");
    return signupHTML;
  });

  // signup
  fastify.post("/signup", (request, reply) => {
    const { username, password } = request.body;
    const extantUser = fastify.db.users.find(
      (user) => user.username === username
    );

    if (extantUser) {
      throw new Error("User Already Exists");
    }

    const user = { id: fastify.db.users.length + 1, username, password };
    fastify.db.users.push(user);
    fastify.log.info(fastify.db.users);
    reply.redirect("/auth/passport");
  });

  // logout
  fastify.get("/logout", async (request, reply) => {
    if (request.isAuthenticated()) {
      await request.logOut();
      await request.session.destroy();
    }
    return reply.redirect("/auth/passport");
  });

  fastify.get("/passport", (request, reply) => {
    reply.type("text/html");
    return passportLogin;
  });

  fastify.post(
    "/passport",
    {
      preValidation: fastify.fastifyPassport.authenticate(
        "local",
        {},
        async (req, rep, err, user) => {
          if (err) {
            fastify.log.error(err);
            return rep.redirect("/auth/passport");
          }
          if (!user) {
            return rep.redirect("/auth/passport");
          }
          await req.logIn(user, req);
          return rep.redirect("/");
        }
      ),
    },
    () => {}
  );
};

export default auth;
