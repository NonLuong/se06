import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { authenticateUser } from "../../services/https/Authen/authen"; // Import your authentication service
import "./Login.css";
import logo from "../../assets/logo1.png"; // Import logo
import background from "../../assets/bg3.png"; // Import background

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (email === "" || password === "") {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      // Call the authentication service
      const result = await authenticateUser(email, password);

      // Check if result is null or undefined
      if (!result) {
        setErrorMessage("การเข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง");
        return;
      }

      if (result.error) {
        setErrorMessage(result.error); // Show error message
      } else {
        setErrorMessage(""); // Clear error message

        // Navigate to the appropriate path based on the role
        switch (result.role) {
          case "admin":
            navigate("/admin");
            break;
          case "employee":
            navigate("/employee");
            break;
          case "driver":
            navigate("/driver");
            break;
          case "passenger":
            navigate("/passenger");
            break;
          default:
            setErrorMessage("Unknown role. Please contact support.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        background: `url(${background}) no-repeat center center`, // Background
        backgroundSize: "cover", // Cover the entire screen
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        className="login-form"
        style={{
          position: "absolute",
          left: "75%",
          transform: "translateX(-50%)",
        }}
      >
        <img src={logo} alt="Logo" className="logo" />
        <h2>เข้าสู่ระบบ</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรุณากรอกอีเมล"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรุณากรอกรหัสผ่าน"
              required
            />
          </div>
          <button type="submit" className="login-btn">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
