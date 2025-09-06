import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar1 from "./navigationbar/NavBar1";
import EmpNavBar from "./employee/EmpNavBar";
import AdminNavBar from "./admin/AdminNavBar";
import { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);

  useEffect(() => {
    setIsAdminLoggedIn(sessionStorage.getItem("isAdminLoggedIn") === "true");
    setIsEmployeeLoggedIn(sessionStorage.getItem("isEmployeeLoggedIn") === "true");
  }, []);

  const onAdminLogin = () => {
    sessionStorage.setItem("isAdminLoggedIn", "true");
    setIsAdminLoggedIn(true);
  };

  const onEmployeeLogin = () => {
    sessionStorage.setItem("isEmployeeLoggedIn", "true");
    setIsEmployeeLoggedIn(true);
  };

  return (
    <NextUIProvider>
      <BrowserRouter>
        {isAdminLoggedIn ? (
          <AdminNavBar setIsAdminLoggedIn={setIsAdminLoggedIn} />
        ) : isEmployeeLoggedIn ? (
          <EmpNavBar setIsEmployeeLoggedIn={setIsEmployeeLoggedIn} />
        ) : (
          <NavBar1
            onAdminLogin={onAdminLogin}
            onEmployeeLogin={onEmployeeLogin}
          />
        )}
        <Footer /> {/* Footer is now inside BrowserRouter */}
      </BrowserRouter>
    </NextUIProvider>
  );
}

export default App;
