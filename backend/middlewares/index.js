const jwt = require("jsonwebtoken");
const { User } = require("@models");
const verifyToken = (req, res, next) => {
  // console.log("Middleware verifyToken invoqué");
  try {
    const authorization = req.headers.authorization;
    // console.log("authorization ", req.headers, authorization);
    if (authorization) {
      const token = authorization.split(" ")[1];
      if (token?.trim() !== "") {
        jwt.verify(
          token,
          process.env.JWT_SECRET_KEY,
          async (err, decodedToken) => {
            if (err) res.status(403).send({ message: "invalidToken" });
            if (decodedToken) {
              const user = await User.findOne({ _id: decodedToken.userId })
                .select("-password -__v")
                .exec();
              if (user) {
                req.user = user;
                next();
              } else {
                res.clearCookie("accessToken", {
                  httpOnly: true,
                  maxAge: process.env.EXPIRATION_TOKEN,
                });
                return res.status(401).send({ message: "Unauthorized 1" });
              }
            }
          }
        );
      } else {
        return res.status(401).send({ message: "Unauthorized 2" });
      }
    } else {
      return res.status(401).send({ message: "Unauthorized 3" });
    }
  } catch (e) {
    return res.status(500).send();
  }
};

const verifyRoles = (roles) => {
  return async (req, res, next) => {
    try {
      if(req.user){
        const user = req.user;
        const hasRole = roles.some(role => user.roles.includes(role));
        if (!hasRole) {
          return res.status(403).json({ message: 'Access denied' });
        }
        next();
      }else{
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error verifying roles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = {
  verifyToken,
  verifyRoles
  // verifyTokenAndAuthorization,
  // verifyTokenAndAdmin,
};
