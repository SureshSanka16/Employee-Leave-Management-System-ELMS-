import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import BackendURLS from "../config";

// Styled login button
const StyledButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  font-size: 14px;
  margin-top: 20px;
  padding: 12px 18px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    color: #2d2d2d;
  }
`;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
    background: "transparent",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#fff",
    textAlign: "center",
  },
  card: {
    width: "380px",
    padding: "40px 30px", // increased padding
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  login: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "22px", // ✅ more gap between fields
    marginTop: "25px", // ✅ gap between heading and first field
  },
  loginInput: {
    border: "none",
    borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    padding: "14px", // ✅ bigger input padding
    fontWeight: "500",
    fontSize: "15px",
    color: "#fff",
    outline: "none",
    borderRadius: "8px",
  },
};

const AdminLogin = ({ onAdminLogin }) => {
  const [auname, setauname] = useState("");
  const [apwd, setapwd] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username: auname, password: apwd };

    try {
      const response = await axios.post(
        `${BackendURLS.Admin}/checkadminlogin`,
        data
      );

      if (response != null) {
        if (response.status === 200) {
          toast.success("Admin Logged in successfully!", {
            theme: "colored",
            autoClose: 1000,
          });

          sessionStorage.setItem("admin", JSON.stringify(response.data.admin));
          if (response?.data?.token) {
            sessionStorage.setItem(
              "AdminToken",
              "Bearer " + response.data.token.replace(/"/g, "")
            );
          }

          setTimeout(() => {
            onAdminLogin();
            navigate("/admin/AdminHome");
          }, 1000);
        } else if (response.status === 404) {
          toast.error("Invalid Credentials", { theme: "colored" });
        } else {
          console.log("Server Error");
        }
      }
    } catch (e) {
      toast.error(e.response?.data || "Login failed", { theme: "colored" });
    }
  };

  return (
    <div style={styles.container}>
      <motion.span
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Admin Login
      </motion.span>

      <motion.div
        style={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          style={{ ...styles.title, fontSize: "20px", marginBottom: "18px" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Login
        </motion.h2>

        <form style={styles.login} onSubmit={handleSubmit}>
          <input
            type="text"
            style={styles.loginInput}
            placeholder="Username"
            onChange={(e) => setauname(e.target.value)}
          />
          <input
            type="password"
            style={styles.loginInput}
            placeholder="Password"
            onChange={(e) => setapwd(e.target.value)}
          />
          <StyledButton type="submit">Log in</StyledButton>
        </form>
      </motion.div>

      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
