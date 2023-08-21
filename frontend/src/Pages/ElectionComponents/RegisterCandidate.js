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

        <label className="label-reg">سال ورود</label>
        <select type="text" className="text-input-reg">
          <option value="98">98</option>
          <option value="99">99</option>
          <option value="1400">1400</option>
          <option value="1401">1401</option>
        </select>

        <label className="label-reg">عنوان انتخابات</label>
        <select type="text" className="text-input-reg">
          <option>انتخابات انجمن علمی دانشگاه اصفهان</option>
        </select>
      </div>
      <div className="register-button-wrapper">
        <button className="register-button">عضویت</button>
      </div>
    </div>
  );
}
