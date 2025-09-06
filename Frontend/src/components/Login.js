import  { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
// import img1 from "./images/img1.jpg";
import BackendURLS from "../config";

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
    background: "transparent", // ✅ remove background (use global)
  },
  card: {
    width: "380px",
    padding: "30px 25px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.1)", // glass effect
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
    gap: "18px",
    marginTop: "20px",
  },
loginInput: {
    border: "none",
    borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.1)", // semi-transparent
    backdropFilter: "blur(6px)",           // blur effect
    WebkitBackdropFilter: "blur(6px)",    // for Safari
    padding: "12px",
    fontWeight: "500",
    fontSize: "15px",
    color: "#fff",
    outline: "none",
    borderRadius: "8px",                   // optional, softer edges
}
,
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "15px",
    marginBottom: "10px",
    color: "#fff",
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "-10px",
    marginLeft: "5px",
  },
};

const dialogStyles = {
  dialog: {
    width: "400px",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    background: "#4C489D",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

const Login = ({ onEmployeeLogin }) => {
  const [uname, setuname] = useState("");
  const [upwd, setupwd] = useState("");
  const [otpDialogVisible, setOtpDialogVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username: uname, password: upwd };

    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/checkemplogin`,
        data
      );
      if (response && response.status === 200) {
        sendOTP(uname);
      } else if (response.status === 401) {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        theme: "colored",
      });
    }
  };

  const sendOTP = async (uname) => {
    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/sendotp/${uname}`,
        { username: uname }
      );
      if (response.status === 200) {
        setOtpDialogVisible(true);
      } else {
        toast.error("Error sending OTP");
      }
    } catch (error) {
      toast.error(error.response?.data || "OTP error", { theme: "colored" });
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/verifyotp/${uname}`,
        { otp }
      );
      if (response.status === 200) {
        toast.success("OTP verified. Login successful!", {
          theme: "colored",
          autoClose: 1000,
        });
        sessionStorage.setItem("employee", JSON.stringify(response.data.employee));
        sessionStorage.setItem("EmployeeToken", "Bearer " + response.data.token.replace(/"/g, ""));
        setTimeout(() => {
          onEmployeeLogin();
          navigate(`/employee/EmpHome`);
        }, 1000);
      } else {
        toast.error("Incorrect OTP", { theme: "colored" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed", {
        theme: "colored",
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* <img
        src={img1}
        alt="Employee"
        style={{ width: "120px", height: "120px", borderRadius: "20%" }}
      /> */}
      <motion.span
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Employee Login
      </motion.span>

   <motion.div
  style={styles.card}
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
>
  {/* Heading inside the card */}
  <motion.h2
  style={{ ...styles.title, marginBottom: "12px", fontSize: "20px" }} // reduced margin
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Employee Login
</motion.h2>


  <form style={styles.login} onSubmit={handleSubmit}>
    <label style={styles.label}>Employee ID</label>
    <input
      type="text"
      style={styles.loginInput}
      placeholder="Enter Employee ID"
      onChange={(e) => setuname(e.target.value)}
    />
    <label style={styles.label}>Password</label>
    <input
      type="password"
      style={styles.loginInput}
      placeholder="Enter Password"
      onChange={(e) => setupwd(e.target.value)}
    />
    <StyledButton type="submit">Log in</StyledButton>
  </form>
</motion.div>


      <ToastContainer />
      <Dialog
        visible={otpDialogVisible}
        onHide={() => setOtpDialogVisible(false)}
        style={dialogStyles.dialog}
        header="Verification"
      >
        <h2 style={dialogStyles.header}>Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={dialogStyles.input}
        />
        <Button label="Verify OTP" onClick={verifyOTP} style={dialogStyles.button} />
        <ToastContainer />
      </Dialog>
    </div>
  );
};

export default Login;
