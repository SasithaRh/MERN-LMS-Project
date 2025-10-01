
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { InstructorContext } from "../../../../context/instructor-context";

import { useContext } from "react";

function CourseSettings() {


  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        
      </div>
      <CardContent>
        
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              
              type="file"
              accept="image/*"
            />
          </div>
        
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
