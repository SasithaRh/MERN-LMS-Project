import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import VideoPlayer from "../../../components/video-player";
import { AuthContext } from "../../../context/auth-context";
import { StudentContext } from "../../../context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "../../../services";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Lock,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
            -1
          );
          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );
      if (response?.success) fetchCurrentCourseProgress();
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-gray-100">
      {showConfetti && <Confetti />}
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#1F2937]">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            className="text-gray-300 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to My Courses
          </Button>
          <h1 className="hidden md:block text-lg font-semibold">
            {studentCurrentCourseProgress?.courseDetails?.title || "Loading..."}
          </h1>
        </div>
        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          variant="ghost"
          className="text-gray-300 hover:text-white"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <section
          className={`flex-1 transition-all duration-300 ${
            isSideBarOpen ? "mr-[400px]" : ""
          }`}
        >
          <VideoPlayer
            width="100%"
            height="520px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-1">{currentLecture?.title}</h2>
            <p className="text-gray-400 text-sm">
              Lesson progress is saved automatically.
            </p>
          </div>
        </section>

        {/* Sidebar */}
        <aside
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1F2937] border-l border-gray-700 transition-transform duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-2 bg-[#111827] h-14">
              <TabsTrigger
                value="content"
                className="text-gray-300 hover:text-white rounded-none"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-gray-300 hover:text-white rounded-none"
              >
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Course Content */}
            <TabsContent value="content" className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => {
                      const viewed = studentCurrentCourseProgress?.progress?.find(
                        (p) => p.lectureId === item._id
                      )?.viewed;
                      return (
                        <div
                          key={item._id}
                          onClick={() => setCurrentLecture(item)}
                          className={`flex items-center gap-3 text-sm font-medium cursor-pointer p-3 rounded-md transition-all ${
                            viewed
                              ? "bg-green-900/30 text-green-400"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          {viewed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="truncate">{item?.title}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Overview */}
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-5 space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    About this course
                  </h2>
                  <p className="text-gray-400 leading-relaxed">
                    {
                      studentCurrentCourseProgress?.courseDetails
                        ?.description || "No description available."
                    }
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>
      </main>

      {/* Locked Course Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[420px] text-center">
          <DialogHeader>
            <Lock className="mx-auto h-12 w-12 text-red-500" />
            <DialogTitle className="mt-3 text-xl font-bold text-gray-900">
              Access Restricted
            </DialogTitle>
            <DialogDescription>
              You must purchase this course to view its content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/")}>Go to Courses</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[420px] text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">
              🎉 Congratulations!
            </DialogTitle>
            <DialogDescription>
              <Label>You’ve successfully completed the course.</Label>
             <div className="flex justify-center gap-4 mt-6">
  <Button
    onClick={() => navigate("/student-courses")}
    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
  >
    Back to My Courses
  </Button>

  <Button
    onClick={handleRewatchCourse}
    className="border border-indigo-400 text-indigo-500 font-semibold px-6 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
  >
    Rewatch Course
  </Button>
</div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
