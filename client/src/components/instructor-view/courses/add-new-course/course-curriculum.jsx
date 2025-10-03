
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Switch } from "../../../ui/switch";
import { InstructorContext } from "../../../../context/instructor-context";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";
import { courseCurriculumInitialFormData } from "../../../../config";
function CourseCurriculum() {
  
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
   
  } = useContext(InstructorContext);


  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
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
            variant="outline"
            className="cursor-pointer"
            
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
         // disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        
        <div className="mt-4 space-y-4">
           {courseCurriculumFormData.map((curriculumItem, index) => (
            <div className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture </h3>
                <Input
                  name='title'
                  placeholder="Enter lecture title"
                  className="max-w-96"
                 
                />
                <div className="flex items-center space-x-2">
                  <Switch
                   
                    checked={true}
                    id={`freePreview`}
                  />
                  <Label htmlFor={`freePreview`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
               
                  <div className="flex gap-3">
                  
                    <Button >
                      Replace Video
                    </Button>
                    <Button
                  
                      className="bg-red-900"
                    >
                      Delete Lecture
                    </Button>
                  </div>
               
                  <Input
                    type="file"
                    accept="video/*"
                   ame="mb-4"
                  />
                
              </div>
            </div>
               ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
