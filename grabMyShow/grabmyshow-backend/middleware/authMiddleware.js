const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {

    let token = null;

    // 1️⃣ Header se token lo
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Agar header me nahi mila toh cookie se lo
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3️⃣ Agar token hi nahi mila
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};