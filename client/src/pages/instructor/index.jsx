 import InstructorCourses from "../../components/instructor-view/courses";
import InstructorDashboard from "../../components/instructor-view/dashboard";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { AuthContext } from "../../context/auth-context";
import { Bell } from "lucide-react";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials,auth } = useContext(AuthContext);
 const [openProfileMenu, setOpenProfileMenu] = useState(false);


  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard/>,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses  />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }


  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 text-white hidden md:flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold tracking-wide">Instructor View</h2>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((menuItem) => {
            const isActive = activeTab === menuItem.value;
            return (
              <button
                key={menuItem.value}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
                className={`relative flex items-center w-full px-4 py-3 rounded-lg text-left font-medium transition-all
                  ${isActive ? "bg-white/20 shadow-md" : "hover:bg-white/10"}`}
              >
                {/* Active line indicator */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-lg"></span>
                )}
                <menuItem.icon className="mr-3 h-5 w-5" />
                {menuItem.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 text-sm text-white/80">
          © {new Date().getFullYear()} Your App
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
          {/* Left: Title */}
          <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />

            {/* Notifications */}
            <button className="relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setOpenProfileMenu(!openProfileMenu)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Instructor"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <span className="hidden md:block font-medium">Hello, {auth.user.userName} 👋</span>
              </button>

              {/* Dropdown */}
              {openProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {menuItems.map((menuItem) => (
                <TabsContent key={menuItem.value} value={menuItem.value}>
                  {menuItem.component !== null ? (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      {menuItem.component}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-12">
                      No content available
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
