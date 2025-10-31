import { useContext, useEffect, useState } from "react";
import { courseCategories } from "../../../config";
import banner from "../../../../public/banner-img.png";
import { Button } from "../../../components/ui/button";
import { StudentContext } from "../../../context/student-context";
import { fetchStudentViewCourseListService } from "../../../services";
import { AuthContext } from "../../../context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

    function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }
  
  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  // Calculate pagination values
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses =
    studentViewCoursesList?.slice(indexOfFirstCourse, indexOfLastCourse) || [];

  const totalPages = Math.ceil(
    (studentViewCoursesList?.length || 0) / coursesPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-12 px-6 lg:px-16 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white shadow-lg ">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Learning That <span className="text-yellow-300">Empowers You</span>
          </h1>
          <p className="text-lg mb-6">
            Skills for your present and your future. Learn, grow, and achieve
            your goals with us.
          </p>
          <Button
            onClick={() => navigate("/courses")}
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg  hover:text-amber-50 transition-all duration-300"
          >
            Explore Courses
          </Button>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <img
            src={banner}
            alt="Learning Banner"
            width={600}
            height={400}
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-6 lg:px-16 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-indigo-500 pl-3">
          Course Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              key={categoryItem.id}
             onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              className="justify-start bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold hover:from-indigo-200 hover:to-purple-200 hover:scale-105 transition-all rounded-lg shadow-sm"
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-6 lg:px-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-pink-500 pl-3">
          Featured Courses
        </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {currentCourses.length > 0 ? (
            currentCourses.map((courseItem) => (
              <div
                key={courseItem.id}
                onClick={() => navigate(`/course/${courseItem.id}`)}
                className="border rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-105 cursor-pointer transition-transform duration-300 bg-white"
              >
                <img
                  src={courseItem?.image}
                  alt={courseItem?.title}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2 text-lg text-gray-900">
                    {courseItem?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-semibold text-indigo-600 text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No Courses Found
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-6 py-2 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </Button>

            <span className="font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-6 py-2 text-sm font-medium disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentHomePage;
