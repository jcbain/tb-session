export const processLocalResponse = function (db) {
  return function (username, password, cb) {
    const foundUser = db.users.find((user) => user.username === username);
    if (!foundUser) {
      const err = new Error("NO USER");
      return cb(err);
    }
    if (foundUser.password !== password) {
      const err = new Error("NOT TODAY SATAN");
      return cb(err);
    }

    return cb(null, foundUser);
  };
};
