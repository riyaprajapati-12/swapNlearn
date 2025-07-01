import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./pages/Dashboard/Dashboard.jsx";
import ProfileCard from "./components/ProfileCard";
import NewUserProfileForm from "./components/NewUserProfileForm.jsx";
import MyRatingPage from "./pages/MyRatingPage";
import RateUserPage from "./pages/RateUserPage";
import RequestPage from "./components/RequestPage";
import ChatApp from "./Chat/ChatApp";
import IntroPage from "./pages/IntroPage.jsx";
import NewLogin from "./pages/Login/Signup/NewLogin.jsx";
import NewSignup from "./pages/Login/Signup/NewSignup.jsx";
import NewProfilePage from "./pages/Profilepage/NewProfilePage.jsx";
import NewCard from "./components/NewCard.jsx";
import ListRoadMap from "./components/ListRoadMap.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/signup" element={<NewSignup />} />
        <Route path="/login" element={<NewLogin />} />
        <Route
          path="/listroadmap"
          element={
            <ProtectedRoute>
              <ListRoadMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card"
          element={
            <ProtectedRoute>
              <NewCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilecard"
          element={
            <ProtectedRoute>
              <ProfileCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userprofileform"
          element={
            <ProtectedRoute>
              <NewUserProfileForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myratingpage"
          element={
            <ProtectedRoute>
              <MyRatingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rateuserpage"
          element={
            <ProtectedRoute>
              <RateUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requestpage"
          element={
            <ProtectedRoute>
              <RequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatapp"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <NewProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
