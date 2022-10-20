import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import blogsRouter from "./api/blogs/index.js";
import authorsRouter from "./api/authors/index.js"
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandling.js";



const server = express();
const port = 3002;

server.use(cors());
server.use(express.json());

server.use("/blogs", blogsRouter)
server.use("/authors", authorsRouter)

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
