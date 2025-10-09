import FormControls from "../../../common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { courseLandingPageFormControls } from "../../../../config";
import { InstructorContext } from "../../../../context/instructor-context";
import { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);

  return (
    <Card className="overflow-hidden shadow-lg border-none rounded-2xl">
      {/* Header Section */}
      <CardHeader className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-6 px-8">
        <div>
          <CardTitle className="text-3xl font-extrabold tracking-wide">
            Course Landing Page
          </CardTitle>
          <p className="text-sm opacity-90 mt-1">
            Set up your course details, description, and category information
          </p>
        </div>
      </CardHeader>

      {/* Form Section */}
      <CardContent className="p-8 bg-gray-50">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
