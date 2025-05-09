const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    token = token.split(" ")[1]; // Extract the token from the Bearer prefix

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      } else {
        console.log(decoded);
        req.user = decoded;  
        return next();  
      }
    });
  } else {
    return res.status(400).json({ message: "Token not provided" });
  }
};

module.exports = verifyToken;
