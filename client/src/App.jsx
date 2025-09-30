import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/index";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentHomePage from "./pages/student/home";
import RouteGuard from "./components/route-guard";


function App() {

 const { auth } = useContext(AuthContext);
  return (
    <Routes>
      {/* <Route  path="/auth" element={<AuthPage />} /> */}
        <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route path="home" element={<StudentHomePage />} />
    </Routes>
    
  )
}

export default App
