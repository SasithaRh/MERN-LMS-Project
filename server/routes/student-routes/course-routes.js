import express from "express";
import {
  getStudentViewCourseDetails,
  getAllStudentViewCourses
} from "../../controllers/student-controller/course-controller.js";
const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);


export default router;
