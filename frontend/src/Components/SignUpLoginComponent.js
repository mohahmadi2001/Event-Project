import React from "react";
import { useState } from "react";
import { Modal, Button } from "antd";
import { ModalAntd } from "./ModalAntd";

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

  //Form Validation

  //Send form data to server-side
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    student_number: "",
    is_student: true,
  });
  console.log(formData);
  function handleChange(e) {
    let newFormData = { ...formData };
    newFormData[e.target.name] = e.target.value;
    setFormData(newFormData);
  }

  const url = "http://127.0.0.1:8000/accounts/user-registration/";
  function handleSubmit() {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  const handleOk = () => {
    setIsModalOpen(false);
    handleSubmit();
  };

  //Toggle Forms
  const [showSignUp, setShowSignUp] = useState(true);

  const toggleForm = () => {
    setShowSignUp(!showSignUp);
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
            ثبت‌نام
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
                    value={formData.first_name}
                    name="first_name"
                    onChange={handleChange}
                    required
                  />
                  <label className="label">نام</label>

                  <input
                    type="text"
                    className="text-input"
                    value={formData.last_name}
                    name="last_name"
                    onChange={handleChange}
                    required
                  />
                  <label className="label">نام خانوادگی</label>

                  <input
                    type="email"
                    className="text-input"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    required
                  />
                  <label className="label">ایمیل</label>

                  <input
                    type="text"
                    className="text-input"
                    value={formData.mobile}
                    name="mobile"
                    onChange={handleChange}
                    required
                  />
                  <label className="label">شماره تماس</label>

                  <input
                    type="password"
                    className="password-input"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    required
                  />
                  <label className="label">رمز عبور</label>

                  <input
                    type="password"
                    className="password-input password-repeat"
                    value={formData.confirm_password}
                    name="confirm_password"
                    onChange={handleChange}
                    required
                  />
                  <label className="label">تکرار رمز عبور</label>

                  <input
                    type="checkbox"
                    className="text-input"
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <label className="label">:دانشجو هستم</label>

                  {isChecked && (
                    <>
                      <input
                        type="text"
                        className="text-input"
                        value={formData.student_number}
                        name="student_number"
                        onChange={handleChange}
                      />
                      <label className="label">شماره دانشجویی</label>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="login-form">
                  <input type="text" className="text-input" />
                  <label className="label">نام کاربری</label>

                  <input
                    type="password"
                    className="password-input password-login"
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
