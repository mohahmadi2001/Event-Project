// import React from "react";
// import { Modal } from "antd";
// import { ModalAntd } from "./ModalAntd";
// import { useState } from "react";

// export default function SignUpLoginForms({ isOpen, onOk, onCancel }) {
//   //chech wether the user is student or not
//   const [isChecked, setIsChecked] = useState(false);

//   //Form Validation

//   //Send form data to server-side
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     mobile: "",
//     student_id: "",
//   });
//   // console.log(formData);
//   function handleChange(e) {
//     let newFormData = { ...formData };
//     newFormData[e.target.name] = e.target.value;
//     setFormData(newFormData);
//   }

//   //Toggle Forms
//   const [showSignUp, setShowSignUp] = useState(true);

//   const toggleForm = () => {
//     setShowSignUp(!showSignUp);
//   };

//   return (
//     <ModalAntd>
//       <Modal
//         open={isOpen}
//         onOk={onOk}
//         onCancel={onCancel}
//         footer={null}
//         okText="ثبت‌نام "
//         cancelText="لغو"
//       >
//         <>
//           <div className="form-toggle">
//             <button
//               className={!showSignUp ? "active--SL" : "login--toggler"}
//               onClick={toggleForm}
//               value="login"
//             >
//               ورود
//             </button>

//             <button
//               className={showSignUp ? "active--SL" : "signup--toggler"}
//               onClick={toggleForm}
//               value="signup"
//             >
//               ثبت‌نام
//             </button>
//           </div>
//           <div className="form-wrapper">
//             {showSignUp ? (
//               <>
//                 <div className="signup-form">
//                   <input
//                     type="text"
//                     className="text-input"
//                     value={formData.first_name}
//                     name="first_name"
//                     onChange={handleChange}
//                     required
//                   />
//                   <label className="label">نام</label>

//                   <input
//                     type="text"
//                     className="text-input"
//                     value={formData.last_name}
//                     name="last_name"
//                     required
//                   />
//                   <label className="label">نام خانوادگی</label>

//                   <input
//                     type="email"
//                     className="text-input"
//                     value={formData.email}
//                     name="email"
//                     required
//                   />
//                   <label className="label">ایمیل</label>

//                   <input
//                     type="text"
//                     className="text-input"
//                     value={formData.mobile}
//                     name="mobile"
//                     required
//                   />
//                   <label className="label">شماره تماس</label>

//                   <input
//                     type="password"
//                     className="password-input"
//                     value={formData.password}
//                     name="password"
//                     required
//                   />
//                   <label className="label">رمز عبور</label>

//                   <input
//                     type="password"
//                     className="password-input password-repeat"
//                     required
//                   />
//                   <label className="label">تکرار رمز عبور</label>

//                   <input
//                     type="checkbox"
//                     className="text-input"
//                     onChange={() => setIsChecked(!isChecked)}
//                   />
//                   <label className="label">:دانشجو هستم</label>

//                   {isChecked && (
//                     <>
//                       <input
//                         type="text"
//                         className="text-input"
//                         value={formData.student_id}
//                         name="student_id"
//                       />
//                       <label className="label">شماره دانشجویی</label>
//                     </>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="login-form">
//                   <input type="text" className="text-input" />
//                   <label className="label">نام کاربری</label>

//                   <input
//                     type="password"
//                     className="password-input password-login"
//                   />
//                   <label className="label">رمز عبور</label>
//                 </div>
//               </>
//             )}
//           </div>
//         </>
//       </Modal>
//     </ModalAntd>
//   );
// }
