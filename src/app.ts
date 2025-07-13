import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";

const app = express();

app.use(express.json());

app.use("/api/v1/", router);
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to tour management backend system 🚀🚀🚀",
  });
});

export default app;
