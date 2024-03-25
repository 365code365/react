import './App.css';
import LoginPage from "./pages/LoginPage";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
