import express from "express";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  res.send("Hello World");
});

router.post("/shorten", verifyToken, async (req, res) => {
  const { long_url } = req.body;
  console.log({ body: req.body });
  const baseURL = process.env.BASE_URL;
  const urlCode = nanoid(10);

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.user.username,
      },
    });

    console.log("this is the user", user);

    let url = await prisma.url.findFirst({
      where: {
        long_url,
      },
    });
    console.log({ url });

    if (url) {
      return res.status(200).json(url);
    } else {
      console.log("No url found. Creating new url...");
      let short_url_id = `${baseURL}/${urlCode}`;
      url = await prisma.url.create({
        data: { long_url, short_url_id, urlCode, user_id: user.id },
      });
    }

    return res.status(201).json(url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/:code", verifyToken, async (req, res) => {
  try {
    const url = await prisma.url.findFirst({
      where: { urlCode: req.params.code },
    });

    if (url) {
      console.log("Long url found for short url. Redirecting...", url);
      return res.redirect(url.long_url);
    } else {
      return res.status(404).json({ message: "No url found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Some error has occurred" });
  }
});

export default router;
