const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { Session } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.token = authorization.substring(7);
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    return res.status(401).json({ error: "Token missing" });
  }
  next();
};

const verifySession = async (req, res, next) => {
  if (!req.decodedToken)
    return res.status(401).json({ error: "Token missing" });

  const session = await Session.findOne({
    where: { userId: req.decodedToken.id, token: req.token },
  });
  if (!session || !session.isValid)
    return res.status(401).json({ error: "session invalid" });

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
  verifySession,
  errorHandler,
};
