import CourseCurriculum from "../../components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "../../components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "../../components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { InstructorContext } from "../../context/instructor-context";
import { AuthContext } from "../../context/auth-context";
import {
  addNewCourseService,
   fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "../../services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../../config";
function AddNewCoursePage() {

   const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }
  
 function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

     const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }

    console.log(courseFinalFormData, "courseFinalFormData");
  }

    async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log(setCourseFormData, response?.data, "setCourseFormData");
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }

    console.log(response, "response");
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

   useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  console.log(params, currentEditedCourseId, "params");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
       <Button
  disabled={!validateFormData()}
  onClick={handleCreateCourse}
  className={`relative text-sm tracking-wider font-bold px-8 py-3 rounded-lg transition 
    ${!validateFormData()
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white hover:shadow-lg hover:scale-105"}
  `}
>
  SUBMIT
</Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
       <TabsList
    className="w-[500px] flex justify-between p-2 rounded-2xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-xl"
  >
    {["curriculum", "course-landing-page", "settings"].map((tab) => (
      <TabsTrigger
        key={tab}
        value={tab}
        className="w-full text-center relative px-5 py-2 font-semibold via-purple-700 transition-all
                   hover:bg-white/20 hover:shadow-md
                   data-[state=active]:text-indigo-700"
      >
        <span className="relative z-10">{tab.replace("-", " ").toUpperCase()}</span>
        {/* Slim white background for active tab */}
        <span
          className="absolute bottom-1 left-1 right-1 top-1/4 bg-white rounded-xl z-0 transition-all duration-300
                     data-[state=active]:opacity-100"
        />
      </TabsTrigger>
    ))}
  </TabsList>
              <TabsContent value="curriculum">
             <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
              <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
               <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
