
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"

const app = express();

app.use(expressSession({
  secret: 'your secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
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