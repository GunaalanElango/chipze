exports.isAuth = async (req, res, next) => {
  try {
    if (!("isLoggedIn" in req.session)) {
      return res.redirect("/customer/login");
    }
    const { isLoggedIn, customerId } = req.session;
    if (!isLoggedIn && isLoggedIn !== true) {
      return res.redirect("/customer/login");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
