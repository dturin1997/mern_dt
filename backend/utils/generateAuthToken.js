import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAuthToken = (_id, name, lastName, email, isAdmin) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7h" }
  );
};

export default generateAuthToken;
