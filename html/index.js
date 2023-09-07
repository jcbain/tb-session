export const signupHTML = `
    <html>
        <head>
            <link rel="stylesheet" href="/assets/styles.css">
        </head>
        <body>
            <div class="login">
                <h2>Sign Up</h2>
                <form class="form" action="/auth/signup" method="post">
                    <label for="username">username</label>
                    <input type="text" name="username"></input>
                    <label for="password">password</label>
                    <input type="text" name="password">password</input>
                    <button type="submit">Sign Un</button>
                </form>
            </div>
        </body>
    </html>
`;

export const indexHTML = (user) => `
    <html>
        <head>
            <link rel="stylesheet" href="/assets/styles.css">
        </head>
        <body>
        <header>
            <form action='/auth/logout'>
                <button type=submit>Logout</button>
            </form>
        </header>
            <div class="login">
                <h2>YOU DID IT!</h2>
                <p>good work, ${user.username}!</p>
                <p>this page should be private and you should be logged in to be able to view it.</p>
            </div>
        </body>
    </html>
`;

export const login = (type = "passport") => {
  return `<html>
         <head>
             <link rel="stylesheet" href="/assets/styles.css">
         </head>
         <body>
             <div class="login">
                 <h2>Login ${type === "passport" ? "Passport" : "Simple"}</h2>
                 <form class="form" action="/auth/${type}" method="post">
                     <label for="username">username</label>
                     <input type="text" name="username"></input>
                     <label for="password">password</label>
                     <input type="text" name="password">password</input>
                     <button type="submit">Sign In</button>
                 </form>
                         <form class="form" action="/auth/signup">
                     <button type="submit">Sign Up</button>
                 </form>
             </div>
         </body>
     </html>
 `;
};
