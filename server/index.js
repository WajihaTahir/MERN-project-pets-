import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import mongoose from "mongoose";
import petRouter from "./routes/petRoutes.js";

const app = express();

const addMiddlewares = () => {
  app.use(express.json()); //parsing incoming JSON payloads in the request body.
  app.use(
    express.urlencoded({
      //responsible for parsing incoming requests with URL-encoded payloads.
      extended: true, //to parse extended syntax
    })
  );
  app.use(cors()); //cross origin resource sharing, allowing to handle requests from different origin.
};

const addRoutes = () => {
  app.use("/api/users", userRouter);  //to mount the userRouter middleware to the specified path.
  app.use("/api/pets", petRouter);
  //"/api/users -> the base path for the routes handled by the userRouter coming from that file.
  app.use(
    "*",
    (
      req,
      res //to any other url that is not the one mentioned above.
    ) => res.status(404).json({ error: "Endpoint not found." })
  );
};

const startServer = () => {
  const port = process.env.PORT || 5001; //if the port doesn't exists, it should set to 5001.
  app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
  });
};

const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connection to the MongoDB established");
  } catch (error) {
    console.log("error connecting to the MongoDB");
  }
};



//IIFE
(async function controller () {
  await DBConnection();
  addMiddlewares();
  addRoutes();
  startServer();
})()



// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(port, () => {
//       console.log("Mongoose connected and server is running on port " + port);
//     });
//   })
//   .catch((e) => console.log("error connecting mongoose", e));
