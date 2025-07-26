/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/", router);

app.get("/", (_, res
) => {
  res.status(200).json({
    message: "welcome to tour management backend system 🚀🚀🚀",
  });
});

app.use(notFound);
app.use(globalErrorHandler);


export default app;
