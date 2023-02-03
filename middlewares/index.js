const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/login");
  } else {
    next();
  }
};

// const isAdmin = (req, res, next) => {
//   if (req.session.username !== "admin") {
//     const user = req.session.currentUser;
//     res.render("index", {user: user, error: "Unauthorized"});
//   } else {
//     next();
//   }
// };

module.exports = isLoggedIn;
// module.exports = isAdmin;