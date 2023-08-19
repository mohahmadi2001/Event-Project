import "./Election.css";

export default function RegisterCandidate() {
  return (
    <div className="election-container">
      <h2 className="register-can-title">ثبت‌نام کاندیدا</h2>
      <div className="registration-form">
        <label className="label-reg">نام</label>
        <input type="text" className="text-input-reg" required />

        <label className="label-reg">نام خانوادگی</label>
        <input type="text" className="text-input-reg" required />

        <label className="label-reg">شماره تماس</label>
        <input type="text" className="text-input-reg" required />

        <label className="label-reg">شماره دانشجویی</label>
        <input type="text" className="text-input-reg" />
      </div>
      <div className="register-button-wrapper">
        <button className="register-button">عضویت</button>
      </div>
    </div>
  );
}
