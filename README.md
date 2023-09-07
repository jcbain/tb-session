# Fastify Session Sample App

## Installation

Download this repository and install the dependencies

```sh
cd ./tb-session
npm install
```

## Running the app

This application can be run in two modes: `dev` and `debug`. Dev-mode will listen to any changes made while the server is running and restart the application. Debug-mode will attach a debugger so that you can create some breakpoints and step through the code.

```sh
# run dev mode
npm run dev

# run debug mode
npm run debug
```

## Authentication

This toy application provides two mechanisms for authenticating a user one with a username and password and session handling via [@fastify/session](https://github.com/fastify/session) and the other with [@fastify/passport](https://github.com/fastify/fastify-passport) with a local strategy and session handling via @fastify/session.

⚠️ **NOTE:** This app is for demonstration and exploration purposes only and passwords are stored as plain text in memory. Normal authentication flow with a username and password would include the ecrypting and storing of the encrypted password only. For sake of simplicty, I have ignored this step.

### Simple Authentication with @fastify/session

To authenticate via without passport, navigate to `/auth/login` where you can use the sample user (username: `test`, password: `password`) to authenticate and navigate to a protected (a page requiring authorization) root page `/`. When you click "Logout" the session associated with your cookie should be destroyed and navigating to `/` will require you to reauthorize.

### Authentication with @fastify/session + @fastify/passport

To authenticate with a local passport strategy using username and password, go to `/auth/passport` and login with the same sample user above (or create your own by going `/auth/signup`).

#### Current Issues

1. with passport, three session are created in the session store per login.
2. with logout, one of the sessions not associated with the passport are being removed and therefore a "logged out" user can still navigate to routes that need authorization because their session still exists.
