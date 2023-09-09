import { useState, useEffect } from "react";
import "./Election.css";
import { toast } from "react-toastify";
import moment from "jalali-moment";

export default function RegisterCandidate() {
  const [electionInfo, setElectionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState("");

  //Countdown
  const registerEndedAt = new Date(electionInfo[0]?.candidate_registration_end);
  const calculateRemainingTime = () => {
    const now = moment();
    const endDate = moment(registerEndedAt, "YYYY-MM-DDTHH:mm:ssZ");
    const timeRemaining = endDate.diff(now);

    if (timeRemaining <= 0) {
      // Election has ended
      setRemainingTime("انتخابات به پایان رسید.");
    } else {
      const duration = moment.duration(timeRemaining);
      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      let formattedTime = "";

      if (days > 0) {
        formattedTime += `${days} روز `;
      }

      if (hours > 0) {
        formattedTime += `${hours} ساعت `;
      }

      formattedTime += `${minutes} دقیقه ${seconds} ثانیه`;

      setRemainingTime(formattedTime);
    }
  };

  useEffect(() => {
    calculateRemainingTime(); // Calculate initial remaining time

    const intervalId = setInterval(() => {
      calculateRemainingTime();
    }, 1000);

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, [registerEndedAt]);

  //Fetch election data
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    fetch("http://localhost:8000/elections/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setElectionInfo(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  //Send register candidate data to backend server
  const [regCanData, setRegCanData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    student_number: "",
    entry_year: "0",
    election: "0",
    description: "",
  });

  function handleChange(e) {
    let newRegCanData = { ...regCanData };
    newRegCanData[e.target.name] = e.target.value;
    setRegCanData(newRegCanData);
  }

  const urlRegCan = "http://localhost:8000/elections/register-candidate/";
  function handleRegisterCan() {
    if (
      !regCanData.first_name ||
      !regCanData.last_name ||
      !regCanData.mobile ||
      !regCanData.student_number ||
      regCanData.entry_year === "0" ||
      regCanData.election === "0" ||
      !regCanData.description
    ) {
      toast.error("لطفاً تمامی فیلدها را پر کنید.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }

    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    // console.log("Data to be send:", regCanData);
    fetch(urlRegCan, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(regCanData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          toast.success("ثبت‌نام کاندید با موفقیت انجام شد.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.existserror) {
          toast.error("شما قبلا به عنوان کاندید ثبت‌نام کرده‌اید.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.electionerror) {
          toast.error("انتخابات وجود ندارد.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        console.log("Server response:", data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
    setRegCanData({
      first_name: "",
      last_name: "",
      mobile: "",
      student_number: "",
      entry_year: "0",
      election: "0",
      description: "",
    });
  }

  if (loading) {
    return (
      <div className="election-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10rem",
            marginBottom: "2rem",
          }}
        >
          <h5>در حال بارگیری ...</h5>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/Loading_spinner.svg.png"
            alt="spinner"
            style={{ width: "200px" }}
          />
        </div>
      </div>
    );
  }

  // Check if the current time is before or after the election
  const now = new Date();
  const electionStartedAt = new Date(electionInfo[0]?.election_started_at);
  const electionEndedAt = new Date(electionInfo[0]?.election_ended_at);

  if (now > electionStartedAt && now < electionEndedAt) {
    return (
      <div className="election-container">
        <h5 style={{ color: "red", textAlign: "center" }}>
          زمان ثبت‌نام کاندیدا نیست!
        </h5>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="/4867780_prev_ui.png" alt="time-expire" />
        </div>
      </div>
    );
  }

  return (
    <div className="election-container">
      <p style={{ direction: "rtl", textAlign: "center", color: "red" }}>
        زمان باقی مانده تا پایان ثبت‌نام کاندیدا: {remainingTime}
      </p>
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
          <option value="0">---------</option>
          <option value="1">انجمن علمی</option>
        </select>

        <label className="label-reg">توضیحات</label>
        <textarea
          type="text"
          className="text-input-reg"
          name="description"
          value={regCanData.description}
          onChange={handleChange}
          style={{ width: "250px", height: "150px" }}
          placeholder="در این مکان تجربیات، مهارت‌ها و سایر اطلاعات لازم را درج کنید؛ تایید شما به عنوان کاندیدا به این فیلد بستگی دارد:)"
          required
        />
      </div>
      <div className="register-button-wrapper">
        <button
          className="register-button"
          onClick={handleRegisterCan}
          style={{ marginBottom: "40px" }}
        >
          عضویت
        </button>
      </div>
    </div>
  );
}
