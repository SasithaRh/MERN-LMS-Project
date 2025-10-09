import MediaProgressbar from "../../../media-progress-bar";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Switch } from "../../../ui/switch";
import { InstructorContext } from "../../../../context/instructor-context";
import { Upload, Video, Trash2, PlusCircle } from "lucide-react";
import { useContext } from "react";
import { courseCurriculumInitialFormData } from "../../../../config";
import {
  mediaUploadService,
  mediaDeleteService,
} from "../../../../services";
import VideoPlayer from "../../../video-player";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card className="shadow-xl border-none rounded-xl">
      {/* Header Section */}
      <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white rounded-t-xl px-6 py-5">
        <CardTitle className="text-2xl font-extrabold tracking-wide">
          Course Curriculum
        </CardTitle>
        <div>
          <Input
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            className="bg-white text-indigo-600 font-semibold hover:bg-gray-100 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Add Lecture Button */}
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white hover:opacity-90 transition shadow-md"
        >
          <PlusCircle className="h-5 w-5" />
          Add Lecture
        </Button>

        {/* Upload Progress */}
        {mediaUploadProgress && (
          <div className="mt-4">
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          </div>
        )}

        {/* Curriculum Items */}
        <div className="mt-6 space-y-6">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800">
                  Lecture {index + 1}
                </h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-sm"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label
                    htmlFor={`freePreview-${index + 1}`}
                    className="text-gray-700"
                  >
                    Free Preview
                  </Label>
                </div>
              </div>

              {/* Video Section */}
              <div className="mt-5">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-wrap gap-4 items-start">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => handleReplaceVideo(index)}
                        variant="outline"
                        className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Video className="w-4 h-4" />
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <Label className="text-gray-700 mb-2 block">
                      Upload Lecture Video
                    </Label>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) =>
                        handleSingleLectureUpload(event, index)
                      }
                      className="cursor-pointer bg-white hover:border-indigo-500 transition"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
