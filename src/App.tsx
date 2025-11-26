import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { UserProvider } from "./context/UserProvider";
import ProtectionRoute from "./components/ProtectionRoute";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectionRoute />}>
            <Route path="/chat/:roomId/:chatType" element={<ChatPage />} />
          </Route>

          {/* 404 Catch-All: Redirect unknown URLs to Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;