const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/login");
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.username !== "admin") {
    const user = req.session.currentUser;
    res.status(401).send("Unauthorized").redirect("/", {user});
  } else {
    next();
  }
};

module.exports = isLoggedIn;
module.exports = isAdmin;