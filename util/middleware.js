const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    return res.status(401).json({ error: "Token missing" });
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "SequelizeValidationError") {
    const errorList = error.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));
    return res.status(400).json({ errorList });
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "Entry not unique" });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  errorHandler,
};
