import { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { AuthContext } from "../../../context/auth-context";
import { StudentContext } from "../../../context/student-context";
import { fetchStudentBoughtCoursesService } from "../../../services";
import { Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    setLoading(true);
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="p-6 md:p-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 text-lg">
          Continue learning from your enrolled courses
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-72 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentBoughtCoursesList.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-200"
            >
              <CardContent className="p-0 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                    {course?.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    By {course?.instructorName}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                   onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex items-center justify-center w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
            alt="No courses"
            className="w-40 h-40 mb-4 opacity-80"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Courses Found
          </h2>
          <p className="text-gray-500">
            You haven’t enrolled in any courses yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentCoursesPage;
