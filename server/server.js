import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();


mongoose
   .connect("mongodb+srv://SasithaRh:Sasitha123@cluster0.lm9nxpb.mongodb.net/")
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

// app.use(cookieParser());
app.use(express.json());


app.listen(5000, () => {
    console.log('Server is running on port 5000!!!');
  });