/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const starServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("connected to database");
    server = app.listen(5000, () => {
      console.log("server in listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

(async ()=>{
 await starServer(); 
 await seedSuperAdmin();
})();

process.on("unhandledRejection", (error) => {
  console.log("UNHANDLED REJECTION! Shutting down...",error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("UNCAUGHT EXCEPTION REJECTION! Shutting down...",error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

//! unhandledRejection
//! Promise.reject(new Error("I forgot to catch this promise"));

//! uncaughtException
//! throw new Error("I made a mistake");