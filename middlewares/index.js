const isLoggedIn = (req, res, next) => {
  const adminId = "63e686aa3f94eec0df365a08";
  if (req.session._id === adminId) {
    res.render("aut/login", {error: "Admins do not need to see this content."});
  } else if (!req.session.currentUser) {
    res.render("auth/login", {error: "You need to login to access this content or feature."});
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.username !== "admin") {
    const user = req.session.currentUser;
    console.log(user);
    res.render("profile/profile", {user: user, error: "Unauthorized, you only have basic user access."});
  } else {
    next();
  }
};
// admin id: 63e686aa3f94eec0df365a08

module.exports = {isLoggedIn, isAdmin};