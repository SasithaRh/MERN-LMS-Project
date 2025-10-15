import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import authRouters from './routes/auth-routes/index.js'
import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from"./routes/instructor-routes/course-routes.js";
import studentViewCourseRoutes from "./routes/student-routes/course-routes.js";
import studentViewOrderRoutes from "./routes/student-routes/order-routes.js";
import studentCoursesRoutes from "./routes/student-routes/student-courses-routes.js";
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
app.use("/auth", authRouters);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000!!!');
  });