import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardTitle } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Label } from "../../../components/ui/label";
import { Skeleton } from "../../../components/ui/skeleton";
import { ArrowUpDownIcon } from "lucide-react";
import { filterOptions, sortOptions } from "../../../config";
import { AuthContext } from "../../../context/auth-context";
import { StudentContext } from "../../../context/student-context";
import { fetchStudentViewCourseListService } from "../../../services";

// Helper: converts filters into query string
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8; // 4 per row × 2 rows

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  // Filter handling
  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const sectionExists = Object.keys(cpyFilters).includes(getSectionId);

    if (!sectionExists) {
      cpyFilters[getSectionId] = [getCurrentOption.id];
    } else {
      const index = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
      if (index === -1) cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(index, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  // Fetch courses
  async function fetchAllStudentViewCourses(filters, sort) {
    setLoadingState(true);
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
    }
    setLoadingState(false);
  }

  // Handle filters in URL
  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  // Initialize filters/sort
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  // Fetch when filters/sort change
  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  // Cleanup
  useEffect(() => {
    return () => sessionStorage.removeItem("filters");
  }, []);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = studentViewCoursesList.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(studentViewCoursesList.length / coursesPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">
        All Courses
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* -------- Sidebar Filters -------- */}
        <aside className="w-full md:w-64 space-y-4 border rounded-lg shadow-sm bg-white">
          {Object.keys(filterOptions).map((keyItem) => (
            <div key={keyItem} className="p-4 border-b">
              <h3 className="font-bold mb-3 text-indigo-600">
                {keyItem.toUpperCase()}
              </h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex font-medium items-center gap-3"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        filters[keyItem] &&
                        filters[keyItem].includes(option.id)
                      }
                      onCheckedChange={() =>
                        handleFilterOnChange(keyItem, option)
                      }
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* -------- Main Content -------- */}
        <main className="flex-1">
          {/* Sort and Result Count */}
          <div className="flex justify-end items-center mb-6 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5 font-medium"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-gray-800 font-semibold">
              {studentViewCoursesList.length} Results
            </span>
          </div>

          {/* -------- Courses Grid (4 per row) -------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCourses && currentCourses.length > 0 ? (
              currentCourses.map((courseItem) => (
                <Card
                  key={courseItem?._id}
                  className="cursor-pointer hover:shadow-xl transition-all border border-gray-200 rounded-xl"
                >
                  <CardContent className="p-0">
                    <img
                      src={courseItem?.image}
                      alt={courseItem?.title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <CardTitle className="text-lg mb-1 line-clamp-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        By{" "}
                        <span className="font-semibold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Category{" "}
                        <span className="font-semibold">
                          {courseItem?.category
                            ?.replace(/-/g, " ").toUpperCase()}  

                        </span>
                      </p>
                          <p className="text-sm text-gray-600">
                        Languadge{" "}
                        <span className="font-semibold">
                          {courseItem?.primaryLanguage.toUpperCase()}  

                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                          } - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-indigo-600 mt-2">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="font-extrabold text-2xl col-span-4 text-center mt-8">
                No Courses Found
              </h1>
            )}
          </div>

          {/* -------- Pagination -------- */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`rounded-md px-4 py-2 transition-all ${currentPage === index + 1
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
                    }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
