import MediaProgressbar from "../../../media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { InstructorContext } from "../../../../context/instructor-context";
import { mediaUploadService } from "../../../../services";
import { useContext } from "react";
import { Upload } from "lucide-react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );

        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Card className="overflow-hidden shadow-lg border-none rounded-2xl">
      {/* Gradient Header */}
      <CardHeader className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-6 px-6">
        <CardTitle className="text-3xl font-extrabold tracking-wide">
          Course Settings
        </CardTitle>
        <p className="text-sm opacity-90 mt-1">
          Customize your course appearance and branding
        </p>
      </CardHeader>

      <CardContent className="p-8 bg-gray-50">
        {mediaUploadProgress ? (
          <div className="mb-4">
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          </div>
        ) : null}

        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Section - Upload */}
          <div className="w-full md:w-1/2 space-y-4">
            <Label className="text-gray-700 font-medium text-sm">
              Upload Course Thumbnail
            </Label>

            <label
              htmlFor="course-image-upload"
              className="border-2 border-dashed border-indigo-400 hover:border-indigo-600 bg-white 
                         rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer
                         transition hover:shadow-md"
            >
              <Upload className="h-8 w-8 text-indigo-500 mb-2" />
              <span className="text-gray-700 font-medium">
                Click to upload image
              </span>
              <span className="text-gray-400 text-sm mt-1">
                PNG, JPG, or JPEG (max 5MB)
              </span>
              <Input
                id="course-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUploadChange}
              />
            </label>
          </div>

          {/* Right Section - Preview */}
          <div className="w-full md:w-1/2">
            {courseLandingFormData?.image ? (
              <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
                <img
                  src={courseLandingFormData.image}
                  alt="Course Preview"
                  className="object-cover w-full h-64"
                />
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-xl border border-gray-300 bg-white shadow-sm text-gray-400">
                No Image Selected
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
