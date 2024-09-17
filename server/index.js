import express from "express";
import cors from "cors";
import AuthRouter from "./routes/authRouter.js";
import UserRouter from "./routes/userRouter.js";
import UrlsRouter from "./routes/urlsRouter.js";

import bodyParser from "body-parser";

const app = express();
app.use(cors());
const PORT = 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  try {
    res.send({ message: "Hello from an Express API!" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/urls", UrlsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
