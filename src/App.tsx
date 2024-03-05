import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { UserProvider } from "./context/UserProvider";
import ProtectionRoute from "./components/ProtectionRoute";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectionRoute />}>
            <Route path="/chat/:username/:roomname" element={<ChatPage />} />
            <Route path="/chat/:username/:*" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
