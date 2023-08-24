import React from "react";
import "./Profile.css";

export default function Profile() {
  return (
    <div className="homepage-container">
      <h2 className="profile-title" style={{ marginBottom: "2.5rem" }}>
        پروفایل کاربر
      </h2>
      <h5 className="profile-title">ویرایش اطلاعات</h5>
      <div className="form-wrapper">
        <div className="signup-form">
          <input
            type="text"
            className="text-input"
            name="first_name"
            required
          />
          <label className="label">نام</label>

          <input type="text" className="text-input" name="last_name" required />
          <label className="label">نام خانوادگی</label>

          <input type="email" className="text-input" name="email" required />
          <label className="label">ایمیل</label>

          <input type="text" className="text-input" name="mobile" required />
          <label className="label">شماره تماس</label>

          <input type="text" className="text-input" name="student_number" />
          <label className="label" style={{ width: "125px" }}>
            شماره دانشجویی
          </label>
        </div>
      </div>
      <div className="buttons-profile">
        <button className="button" style={{ padding: "8px" }}>
          ویرایش
        </button>
      </div>
      <h5 className="profile-title">تغییر رمز عبور</h5>
      <div className="form-wrapper">
        <div className="signup-form">
          <input
            type="password"
            className="password-input"
            name="password"
            required
          />
          <label className="label">رمز عبور</label>

          <input
            type="password"
            className="password-input password-repeat"
            name="confirm_password"
            required
          />
          <label className="label">تکرار رمز عبور</label>
        </div>
      </div>
      <div className="buttons-profile">
        <button className="button" style={{ padding: "8px" }}>
          ویرایش
        </button>
      </div>
      <h5 className="profile-title">رویدادهای ثبت‌نام شده</h5>
    </div>
  );
}
