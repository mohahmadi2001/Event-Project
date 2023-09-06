import { useState } from "react";
import "./Election.css";

export default function RegisterCandidate() {
  //Getting register candidate time

  //Send register candidate data to backend server
  const [regCanData, setRegCanData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    student_number: "",
    entry_year: "0",
    election: "0",
  });

  function handleChange(e) {
    let newRegCanData = { ...regCanData };
    newRegCanData[e.target.name] = e.target.value;
    setRegCanData(newRegCanData);
  }

  const urlRegCan = "http://127.0.0.1:8000/elections/register-candidate/";
  function handleRegisterCan() {
    console.log("Data to be send:", regCanData);
    fetch(urlRegCan, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regCanData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  return (
    <div className="election-container">
      <h2 className="register-can-title">ثبت‌نام کاندیدا</h2>
      <div className="registration-form">
        <label className="label-reg">نام</label>
        <input
          type="text"
          className="text-input-reg"
          name="first_name"
          value={regCanData.first_name}
          onChange={handleChange}
          required
        />

        <label className="label-reg">نام خانوادگی</label>
        <input
          type="text"
          className="text-input-reg"
          name="last_name"
          value={regCanData.last_name}
          onChange={handleChange}
          required
        />

        <label className="label-reg">شماره تماس</label>
        <input
          type="text"
          className="text-input-reg"
          name="mobile"
          value={regCanData.mobile}
          onChange={handleChange}
          required
        />

        <label className="label-reg">شماره دانشجویی</label>
        <input
          type="text"
          className="text-input-reg"
          name="student_number"
          value={regCanData.student_number}
          onChange={handleChange}
          required
        />

        <label className="label-reg">سال ورود</label>
        <input
          type="number"
          min="0"
          className="text-input-reg"
          name="entry_year"
          value={regCanData.entry_year}
          onChange={handleChange}
          required
        />

        <label className="label-reg">عنوان انتخابات</label>
        <select
          type="text"
          className="text-input-reg"
          name="election"
          value={regCanData.election}
          onChange={handleChange}
          required
        >
          <option>---------</option>
          <option>انجمن علمی</option>
        </select>
      </div>
      <div className="register-button-wrapper">
        <button className="register-button" onClick={handleRegisterCan}>
          عضویت
        </button>
      </div>
    </div>
  );
}
