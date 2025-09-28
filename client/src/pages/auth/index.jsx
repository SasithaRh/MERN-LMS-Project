import CommonForm from "../../components/common-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { signInFormControls, signUpFormControls } from "../../config"
import { AuthContext } from "../../context/auth-context"
import { GraduationCap } from "lucide-react"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext)

  function handleTabChange(value) {
    setActiveTab(value)
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    )
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 lg:px-12 h-16 flex items-center border-b bg-white/80 backdrop-blur-md">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-3 text-indigo-600" />
          <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            LMS LEARN
          </span>
        </Link>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left Side Branding */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-12">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to{" "}
              <span className="text-yellow-300">LMS LEARN</span>
            </h1>
            <p className="text-lg text-indigo-100">
              A modern learning management system to help you grow your
              knowledge, collaborate, and achieve success.
            </p>
            <img
              src="https://cdn.elearningindustry.com/wp-content/uploads/2024/12/A-Step-By-Step-Guide-To-Successfully-Implementing-A-Corporate-LMS.jpg"
              alt="Education Illustration"
              className="w-90 mt-6 drop-shadow-lg rounded-[20px]"
            />
          </div>
        </div>

        {/* Right Side Auth */}
        <div className="flex flex-1 items-center justify-center p-6">
          <Tabs
            value={activeTab}
            defaultValue="signin"
            onValueChange={handleTabChange}
            className="w-full max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-indigo-100 p-1 mb-6">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In */}
            <TabsContent value="signin">
              <Card className="p-6 shadow-lg border border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-indigo-700">
                    Sign in to your account
                  </CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText={"Sign In"}
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Don’t have an account?{" "}
                    <span
                      onClick={() => setActiveTab("signup")}
                      className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                      Sign Up
                    </span>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up */}
            <TabsContent value="signup">
              <Card className="p-6 shadow-lg border border-indigo-100">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-indigo-700">
                    Create a new account
                  </CardTitle>
                  <CardDescription>
                    Fill in your details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText={"Sign Up"}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Already have an account?{" "}
                    <span
                      onClick={() => setActiveTab("signin")}
                      className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                      Sign In
                    </span>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
