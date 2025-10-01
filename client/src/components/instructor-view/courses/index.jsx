import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
// import {
//   courseCurriculumInitialFormData,
//   courseLandingInitialFormData,
// } from "../../../config";
//import { InstructorContext } from "../../../context/instructor-context/index";
import { Delete, Edit,Plus  } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses() {
const navigate = useNavigate();

return (
    <Card className="shadow-xl border-none">
      {/* Header */}
      <CardHeader className="flex justify-between flex-row items-center bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white rounded-t-xl">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() =>  navigate("/instructor/create-new-course")}
          className="flex items-center gap-2 bg-white text-indigo-600 font-semibold shadow hover:bg-gray-100 transition"
        >
          <Plus className="h-5 w-5" />
          Create New Course
        </Button>
      </CardHeader>

      {/* Table */}
      <CardContent className="p-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Course</TableHead>
                <TableHead className="font-semibold text-gray-700">Students</TableHead>
                <TableHead className="font-semibold text-gray-700">Revenue</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="hover:bg-gray-50 transition">
                <TableCell className="font-medium">React Mastery</TableCell>
                <TableCell>120</TableCell>
                <TableCell>$2,300</TableCell>
                <TableCell className="text-center space-x-2">
                  {/* Edit Button */}
                  <Button
                    onClick={() => navigate(`/instructor/edit-course/1`)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-indigo-50 text-indigo-600"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Delete className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-gray-50 transition">
                <TableCell className="font-medium">Node.js Basics</TableCell>
                <TableCell>85</TableCell>
                <TableCell>$1,100</TableCell>
                <TableCell className="text-center space-x-2">
                  <Button
                    onClick={() => navigate(`/instructor/edit-course/2`)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-indigo-50 text-indigo-600"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Delete className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
