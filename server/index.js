import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import mongoose from "mongoose";


const app = express();

const port = process.env.PORT || 5001;  //if the port doesn't exists, it should set to 5001. 

app.use(express.json());  //parsing incoming JSON payloads in the request body. 
app.use(
  express.urlencoded({  //responsible for parsing incoming requests with URL-encoded payloads.
    extended: true,  //to parse extended syntax 
  })
);
app.use(cors()); //cross origin resource sharing, allowing to handle requests from different origin. 

app.use("/api/users", userRouter); //to mount the userRouter middleware to the specified path.
//"/api/users -> the base path for the routes handled by the userRouter coming from that file. 
app.use('*', (req, res) => res.status(404).json({ error: "Endpoint not found." }));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  app.listen(port, () => {
    console.log("Mongoose connected and server is running on port " + port);
  });
}).catch(e => console.log("error connecting mongoose", e));

