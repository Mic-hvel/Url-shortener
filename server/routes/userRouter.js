import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

// router.post("/users", verifyToken, async (req, res) => {
//   const { title, body, author } = req.body;
//   console.log("----", req.body);

//   const userId = await req.user.id;

//   try {
//     const user = await prisma.user.create({
//       data: {
//         title,
//         body,
//         author: {
//           connect: {
//             id: userId,
//           },
//         },
//       },
//     });
//     res.send(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.user.username,
      },
    });

    console.log("User data retrieved successfully", user);
    res.send(user);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send({ error });
  }
});

// router.get("/user/:id", verifyToken, async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.params.id, authorId: req.user.id },
//     });
//     res.send(user);
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// });

// router.put("/users/:id", verifyToken, async (req, res) => {
//   try {
//     const user = await prisma.user.upsert({
//       where: {
//         where: { id: req.params.id },
//       },
//       create: {
//         title,
//         body,
//         comments,
//       },
//     });
//     await user.save();
//     res.send(user);
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// });

// router.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await prisma.user.delete({
//       where: {
//         username: username,
//       },
//     });
//     if (!user) {
//       return res.status(404).send("Item wasn't found");
//     }
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// });

export default router;
