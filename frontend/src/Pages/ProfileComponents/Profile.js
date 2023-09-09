import "./Profile.css";
import { useState, useEffect } from "react";
import jalaliMoment from "jalali-moment";
import { toast } from "react-toastify";

export default function Profile() {
  //User's registerd events
  const [registeredEventsData, setRegisteredEventsData] = useState([]);
  //Get user's registered events
  const urlRegisteredEvents =
    "http://localhost:8000/auth/user/registered-events/";
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }

    fetch(urlRegisteredEvents, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setRegisteredEventsData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Convert iso date to jalali date
  const formatToPersianDate = (isoDate) => {
    const date = new Date(isoDate);
    const jalaliDate = jalaliMoment
      .from(date)
      .locale("fa")
      .format("jD jMMMM jYYYY");
    return jalaliDate;
  };

  //User edit profile
  const [formEditData, setFormEditData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    student_number: "",
  });

  function handleChangeData(e) {
    let newFormEditPass = { ...formEditData };
    newFormEditPass[e.target.name] = e.target.value;
    setFormEditData(newFormEditPass);
  }

  function handleEditData() {
    if (
      formEditData.first_name &&
      formEditData.last_name &&
      formEditData.mobile &&
      formEditData.student_number
    )
      handlePUT();
    else if (
      formEditData.first_name === "" &&
      formEditData.last_name === "" &&
      formEditData.mobile === "" &&
      formEditData.student_number === ""
    ) {
      alert("چیزی برای ویرایش وجود ندارد!");
    } else handlePATCH();
  }

  function handlePUT() {
    const url_PUT_PATCH = "http://localhost:8000/auth/user/update/";

    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      headers.Authorization = `Basic ${base64Credentials}`;
    }

    fetch(url_PUT_PATCH, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(formEditData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        toast.success("اطلاعات با موفقیت ویرایش شد", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000, // Auto close after 5 seconds
        });
      })
      .catch((error) => console.error("Error:", error));
    setFormEditData({
      first_name: "",
      last_name: "",
      mobile: "",
      student_number: "",
    });
  }

  function handlePATCH() {
    const url_PUT_PATCH = "http://localhost:8000/auth/user/update/";

    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      headers.Authorization = `Basic ${base64Credentials}`;
    }

    const editedFields = {}; // Initialize an object to store edited fields

    // Check which fields have been edited and add them to the editedFields object
    if (formEditData.first_name !== "") {
      editedFields.first_name = formEditData.first_name;
    }

    if (formEditData.last_name !== "") {
      editedFields.last_name = formEditData.last_name;
    }

    if (formEditData.mobile !== "") {
      editedFields.mobile = formEditData.mobile;
    }

    if (formEditData.student_number !== "") {
      editedFields.student_number = formEditData.student_number;
    }

    fetch(url_PUT_PATCH, {
      method: "PATCH", // Use PATCH method for partial update
      headers: headers,
      body: JSON.stringify(editedFields), // Send only the edited fields
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        toast.success("اطلاعات با موفقیت ویرایش شد", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000, // Auto close after 5 seconds
        });
      })
      .catch((error) => console.error("Error:", error));
    setFormEditData({
      first_name: "",
      last_name: "",
      mobile: "",
      student_number: "",
    });
  }

  //User edit password
  const [formEditPass, setFormEditPass] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  function handleChangePass(e) {
    let newFormEditPass = { ...formEditPass };
    newFormEditPass[e.target.name] = e.target.value;
    setFormEditPass(newFormEditPass);
  }

  function handleEditPass() {
    if (
      !formEditPass.old_password ||
      !formEditPass.new_password ||
      !formEditPass.confirm_new_password
    ) {
      toast.error("لطفاً تمامی فیلدها را پر کنید.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }

    if (
      formEditPass.old_password &&
      formEditPass.new_password &&
      formEditPass.confirm_new_password
    ) {
      const urlChangePass = "http://localhost:8000/auth/user/change-password/";

      const base64Credentials = localStorage.getItem("credentials");
      const headers = {
        "Content-Type": "application/json",
      };

      if (base64Credentials) {
        headers.Authorization = `Basic ${base64Credentials}`;
      }

      fetch(urlChangePass, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(formEditPass),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.message) {
            toast.success("اطلاعات با موفقیت ویرایش شد", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.incorrecterror) {
            toast.error("رمز عبور فعلی نادرست است.", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
          if (data.matcherror) {
            toast.error("رمز عبور جدید و تکرار آن مطابقت ندارند.", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            });
          }
        })
        .catch((error) => console.error("Error:", error));
      setFormEditPass({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } else if (
      formEditPass.old_password === "" &&
      formEditPass.new_password === "" &&
      formEditPass.confirm_new_password === ""
    ) {
      alert("چیزی برای ویرایش وجود ندارد!");
    }
  }

  const base64Credentials = localStorage.getItem("credentials");
  const decodedBase64Credentials = atob(base64Credentials);
  const [email, password] = decodedBase64Credentials.split(":");

  return (
    <div className="homepage-container">
      <p
        style={{
          direction: "rtl",
          marginRight: "60px",
          color: "#5bb450",
          fontWeight: "bold",
        }}
      >
        خوش اومدی! {email}
      </p>
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
            value={formEditData.first_name}
            onChange={handleChangeData}
          />
          <label className="label">نام</label>

          <input
            type="text"
            className="text-input"
            name="last_name"
            value={formEditData.last_name}
            onChange={handleChangeData}
          />
          <label className="label">نام خانوادگی</label>

          <input
            type="text"
            className="text-input"
            name="mobile"
            value={formEditData.mobile}
            onChange={handleChangeData}
          />
          <label className="label">شماره تماس</label>

          <input
            type="text"
            className="text-input"
            name="student_number"
            value={formEditData.student_number}
            onChange={handleChangeData}
          />
          <label className="label" style={{ width: "125px" }}>
            شماره دانشجویی
          </label>
        </div>
      </div>
      <div className="buttons-profile">
        <button
          className="button"
          style={{ padding: "8px" }}
          onClick={handleEditData}
        >
          ویرایش
        </button>
      </div>
      <h5 className="profile-title">تغییر رمز عبور</h5>
      <div className="form-wrapper">
        <div className="signup-form">
          <input
            type="password"
            className="password-input"
            name="old_password"
            value={formEditPass.old_password}
            onChange={handleChangePass}
          />
          <label className="label">رمز عبور فعلی</label>

          <input
            type="password"
            className="password-input"
            name="new_password"
            value={formEditPass.new_password}
            onChange={handleChangePass}
          />
          <label className="label">رمز عبور جدید</label>

          <input
            type="password"
            className="password-input password-repeat"
            name="confirm_new_password"
            value={formEditPass.confirm_new_password}
            onChange={handleChangePass}
          />
          <label className="label">تکرار رمز عبور</label>
        </div>
      </div>
      <div className="buttons-profile">
        <button
          className="button"
          style={{ padding: "8px", marginBottom: "30px" }}
          onClick={handleEditPass}
        >
          ویرایش
        </button>
      </div>
      <h5 className="profile-title" style={{ marginBottom: "20px" }}>
        رویدادهای ثبت‌نام شده
      </h5>
      <ul className="registered-events-wrapper">
        {registeredEventsData.map((element, i) => (
          <li key={i} style={{ marginBottom: "10px" }}>
            <h6>{element.title}</h6>
            <p style={{ color: "green", fontSize: "14px" }}>
              تاریخ شروع: {formatToPersianDate(element.event_start_time)}
            </p>
            <img
              src={`/${element.event_slug}.jpg`}
              alt="event-img"
              style={{ width: "70px", height: "70px" }}
            />
          </li>
        ))}
      </ul>
      <h5 className="profile-title">وضعیت شرکت در انتخابات</h5>
    </div>
  );
}
