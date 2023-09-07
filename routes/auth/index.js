import fastifyFormbody from "@fastify/formbody";
import { signupHTML, login } from "../../html/index.js";

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

  // basic session without passport
  fastify.get("/login", async (request, reply) => {
    reply.type("text/html");
    return login("login");
  });

  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;
    const foundUser = fastify.db.users.find(
      (user) => user.username === username
    );
    if (!foundUser) {
      return reply.redirect("/auth/login");
    }
    if (foundUser.password !== password) {
      return reply.redirect("/auth/login");
    }

    request.session.authenticated = true;
    request.session.user = foundUser;
    return reply.redirect("/");
  });

  // logout
  fastify.get("/logout", async (request, reply) => {
    let redirect = "/auth/login";
    if (request.isAuthenticated()) {
      await request.logOut();
      await request.session.destroy();
      redirect = "/auth/passport";
    }

    if (request.session.authenticated === true) {
      await request.session.destroy();
    }

    return reply.redirect(redirect);
  });

  fastify.get("/passport", (request, reply) => {
    reply.type("text/html");
    return login();
  });

  // passport
  fastify.post(
    "/passport",
    {
      preValidation: fastify.fastifyPassport.authenticate(
        "local",
        { authInfo: false },
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
