import React from "react";
import { useState } from "react";
import { Modal, Button } from "antd";
import { ModalAntd } from "./ModalAntd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUpLoginComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModal() {
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div>
        <button className="signup-login-button" onClick={showModal}>
          ورود | ثبت‌نام
        </button>
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
  //Check wether the user is student or not
  const [isChecked, setIsChecked] = useState(false);

  //Form Errors / Form Successful
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState();

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

  const urlRegister = "http://127.0.0.1:8000/accounts/user-registration/";
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
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000, // Auto close after 2 seconds
          });
        } else {
          // console.log(data.email[0]);
          if (data.email) return alert("Email address can't be empty.");
          if (data.password) return alert("Password can't be empty.");
          if (data.confirm_password)
            return alert("Confirm Password can't be empty");
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

  const urlLogin = "http://127.0.0.1:8000/accounts/user-login/";
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

  return (
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
          <div className="form-wrapper">
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
  );
}
