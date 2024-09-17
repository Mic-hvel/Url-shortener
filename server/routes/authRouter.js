import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/user", (req, res) => {
  try {
    res.send({ message: "authRouter is functional" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/sign-up", async (req, res, next) => {
  const { username, password, email } = req.body;
  console.log({ body: req.body });

  if (
    !email ||
    !username ||
    !password ||
    email === "" ||
    username === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });
    console.log(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/sign-in", async (req, res, next) => {
  const { username, password } = req.body;
  console.log({ username, password });

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    console.log({ user });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
