const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication token required"
   });
 }
  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(401).json({
      message: "User not found"
    });
  }

   if (!user.isActive) {
      return res.status(403).json({
        message: "Account is inactive"
      });
    }

    req.user = user;

    next();

} catch (error) {
  return res.status(401).json({
    message: "Invalid or expired token"
  });
}
 
};

module.exports = authMiddleware;