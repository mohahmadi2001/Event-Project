import React from "react";
import { useState } from "react";
import { Modal, Button } from "antd";
import { ModalAntd } from "./ModalAntd";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

export default function SignUpLoginComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  function showModal() {
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //Handle logout and re-directing to home page after logging out
  const history = useNavigate();

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    history("/");
    window.scrollTo(0, 0);
  }

  return (
    <>
      <div>
        {isLoggedIn ? (
          <button className="signup-login-logout-button" onClick={handleLogout}>
            <img src="/logout.png" alt="logout-icon" className="logout-icon" />
            خروج
          </button>
        ) : (
          <button className="signup-login-logout-button" onClick={showModal}>
            ورود | ثبت‌نام
          </button>
        )}
      </div>
      <SignUpLoginForms
        isOpen={isModalOpen}
        onCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

function SignUpLoginForms({ isOpen, onCancel, setIsModalOpen }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  //Check wether the user is student or not
  const [isChecked, setIsChecked] = useState(false);

  //Send register form data to server-side
  const [formDataRegister, setFormDataRegister] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    student_number: "",
    is_student: isChecked,
  });
  // console.log(formDataRegister.is_student);
  function handleChangeRegister(e) {
    let newFormDataRegister = { ...formDataRegister };
    if (e.target.name === "is_student") {
      newFormDataRegister[e.target.name] = !isChecked;
      setIsChecked(!isChecked);
    } else newFormDataRegister[e.target.name] = e.target.value;
    setFormDataRegister(newFormDataRegister);
  }

  const urlRegister = "http://localhost:8000/auth/user/register/";
  function handleRegister() {
    // console.log("Data to be send:", formDataRegister);
    fetch(urlRegister, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataRegister),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.message) {
          toast.success("ثبت‌نام با موفقیت انجام شد", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000, // Auto close after 2 seconds
          });
        } else {
          if (data.email) {
            toast.error("ایمیل نمی‌تواند خالی باشد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }

          if (data.password) {
            toast.error("رمز عبور نمی‌تواند خالی باشد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }

          if (data.confirm_password) {
            toast.error("تکرار رمز عبور نمی‌تواند خالی باشد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.non_field_errors) {
            toast.error("رمز عبور و تکرار آن مطابقت ندارد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.non_field_errors && isChecked === true) {
            toast.error("شماره دانشجویی را وارد کنید", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.error) {
            toast.error("(رمز عبور کوتاه است (حداقل ۸ کاراکتر", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
    setFormDataRegister({
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      student_number: "",
      is_student: isChecked,
    });
  }

  //Send login form data to backend server
  const [formDataLogin, setFormDataLogin] = useState({
    email: "",
    password: "",
  });

  function handleChangeLogin(e) {
    let newFormDataLogin = { ...formDataLogin };
    newFormDataLogin[e.target.name] = e.target.value;
    setFormDataLogin(newFormDataLogin);
  }

  const urlLogin = "http://localhost:8000/auth/token/login/";
  function handleLogin() {
    console.log("Data to be send:", formDataLogin);
    fetch(urlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataLogin),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.auth_token) {
          toast.success("ورود با موفقیت انجام شد", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000, // Auto close after 2 seconds
          });
          setIsLoggedIn(true);
          localStorage.setItem("authToken", data.auth_token);
        } else {
          if (data.email) {
            toast.error("ایمیل نمی‌تواند خالی باشد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.password) {
            toast.error("رمز عبور نمی‌تواند خالی باشد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.non_field_errors) {
            toast.error("کاربری با این مشخصات یافت نشد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
    setFormDataLogin({
      email: "",
      password: "",
    });
  }

  const handleOk = () => {
    setIsModalOpen(false);
    showSignUp ? handleRegister() : handleLogin();
  };

  //Toggle Forms
  const [showSignUp, setShowSignUp] = useState(true);

  const toggleForm = () => {
    setShowSignUp(!showSignUp);
    setFormDataRegister({
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      student_number: "",
      is_student: isChecked,
    });
    setFormDataLogin({
      email: "",
      password: "",
    });
  };

  //Pressing the Enter key for logging-in or registering
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      showSignUp ? handleRegister() : handleLogin();
      setIsModalOpen(false);
    }
  }

  return (
    <>
      <ModalAntd>
        <Modal
          open={isOpen}
          // onOk={onOk}
          onCancel={onCancel}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              لغو
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              {showSignUp ? "ثبت‌نام" : "ورود"}
            </Button>,
          ]}
        >
          <>
            <div className="form-toggle">
              <button
                className={!showSignUp ? "active--SL" : "login--toggler"}
                onClick={toggleForm}
                value="login"
              >
                ورود
              </button>

              <button
                className={showSignUp ? "active--SL" : "signup--toggler"}
                onClick={toggleForm}
                value="signup"
              >
                ثبت‌نام
              </button>
            </div>
            <div className="form-wrapper" onKeyDown={handleKeyPress}>
              {showSignUp ? (
                <>
                  <div className="signup-form">
                    <input
                      type="text"
                      className="text-input"
                      value={formDataRegister.first_name}
                      name="first_name"
                      onChange={handleChangeRegister}
                    />
                    <label className="label">نام</label>

                    <input
                      type="text"
                      className="text-input"
                      value={formDataRegister.last_name}
                      name="last_name"
                      onChange={handleChangeRegister}
                    />
                    <label className="label">نام خانوادگی</label>

                    <input
                      type="email"
                      className="text-input"
                      value={formDataRegister.email}
                      name="email"
                      onChange={handleChangeRegister}
                      required
                    />
                    <label className="label">ایمیل</label>

                    <input
                      type="text"
                      className="text-input"
                      value={formDataRegister.mobile}
                      name="mobile"
                      onChange={handleChangeRegister}
                    />
                    <label className="label">شماره تماس</label>

                    <input
                      type="password"
                      className="password-input"
                      value={formDataRegister.password}
                      name="password"
                      onChange={handleChangeRegister}
                      required
                    />
                    <label className="label">رمز عبور</label>

                    <input
                      type="password"
                      className="password-input password-repeat"
                      value={formDataRegister.confirm_password}
                      name="confirm_password"
                      onChange={handleChangeRegister}
                      required
                    />
                    <label className="label">تکرار رمز عبور</label>

                    <input
                      type="checkbox"
                      className="text-input"
                      value={formDataRegister.is_student}
                      name="is_student"
                      onChange={handleChangeRegister}
                    />
                    <label className="label">:دانشجو هستم</label>

                    {isChecked && (
                      <>
                        <input
                          type="text"
                          className="text-input"
                          value={formDataRegister.student_number}
                          name="student_number"
                          onChange={handleChangeRegister}
                        />
                        <label className="label">شماره دانشجویی</label>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="login-form">
                    <input
                      type="text"
                      className="text-input"
                      value={formDataLogin.email}
                      name="email"
                      onChange={handleChangeLogin}
                      required
                    />
                    <label className="label">نام کاربری</label>

                    <input
                      type="password"
                      className="password-input password-login"
                      value={formDataLogin.password}
                      name="password"
                      onChange={handleChangeLogin}
                      required
                    />
                    <label className="label">رمز عبور</label>
                  </div>
                </>
              )}
            </div>
          </>
        </Modal>
      </ModalAntd>
      <ToastContainer />
    </>
  );
}
