import { GraduationCap, TvMinimalPlay, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="bg-gradient-to-r  from-yellow-400 via-orange-500 to-pink-500 text-white shadow-lg">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between p-4 md:p-5">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <Link to="/home" className="flex items-center hover:opacity-90 transition-all">
            <GraduationCap className="h-8 w-8 mr-2" />
            <span className="font-extrabold md:text-xl text-[15px] tracking-wide">
              LMS LEARN
            </span>
          </Link>

          <Button
            variant="ghost"
            onClick={() => {
              if (!location.pathname.includes("/courses")) navigate("/courses");
            }}
            className="text-white hover:bg-white/20 hover:text-white text-[14px] md:text-[16px] font-medium"
          >
            Explore Courses
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-2 hover:opacity-90 transition-all"
          >
            <TvMinimalPlay className="w-6 h-6" />
            <span className="font-semibold text-[14px] md:text-[16px]">
              My Courses
            </span>
          </div>
<Button
  onClick={handleLogout}
  className="bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300"
>
  <LogOut className="w-4 h-4" /> Sign Out
</Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
