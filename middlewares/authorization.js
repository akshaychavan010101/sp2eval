const authorization = (permittedRole) => {
  return async (req, res, next) => {
    try {
      const userRole = req.body.user.role;
      if (permittedRole.includes(userRole)) {
        next();
      } else {
        res.status(401).send({ msg: "Unauthorized User" });
      }
    } catch (error) {
      res.send({ msg: "Server error", Error: error.message });
    }
  };
};

module.exports = { authorization };
