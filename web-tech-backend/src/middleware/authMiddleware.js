const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// PROTECT ROUTES
exports.protect = async (req, res, next) => {
  try {
    let token;

    // check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token"
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from DB (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};

// ROLE-BASED ACCESS
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};