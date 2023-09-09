import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ModalAntd } from "../../Components/ModalAntd";
import jalaliMoment from "jalali-moment";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";

export default function Events() {
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  //Get user's registered events
  const [registeredEvents, setRegisteredEvents] = useState([]);
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
        setRegisteredEvents(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Sending request to backend server for users to register events
  const urlEventRegister = "http://localhost:8000/events/register-event/";
  function handleRegisterEvent() {
    // const authToken = localStorage.getItem("authToken");
    const base64Credentials = localStorage.getItem("credentials");
    if (base64Credentials === null) {
      alert("ابتدا وارد سایت شوید.");
      return;
    }

    if (
      registeredEvents.some(
        (event) => event.event_slug === selected?.event_slug
      )
    ) {
      // Check if the event is already registered
      toast.error("شما قبلا در این رویداد ثبت‌نام کرده‌اید.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000, // Auto close after 5 seconds
      });
      return;
    }

    // console.log("auth", authToken);
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }

    fetch(urlEventRegister, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        event_id: selected?.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);
        if (data.message) {
          toast.success("ثبت‌نام با موفقیت انجام شد.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
        } else if (data.capacityerror) {
          toast.error("ظرفیت رویداد تکمیل است.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
        } else if (data.error) {
          toast.error("شما قبلا در این رویداد ثبت‌نام کرده‌اید.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
        }
      })
      .catch((error) => console.log("Fetch error:", error));
  }

  //Implementing antd modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  function showModal(el) {
    setSelected(el);
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
    handleRegisterEvent();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [eventsData, setEventsData] = useState([]);
  const slicedEventsData = eventsData.slice(0, 4);

  useEffect(() => {
    fetch("http://localhost:8000/events/")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Sort the data by start_event_at in descending order (newest first)
        const sortedData = data.sort(
          (a, b) => new Date(b.start_event_at) - new Date(a.start_event_at)
        );
        setEventsData(sortedData); // Store the sorted data in state
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

  // Function to check if the end date has expired
  const hasDateExpired = (isoStartDate) => {
    const startDate = new Date(isoStartDate);
    const currentDate = new Date();
    return startDate < currentDate;
  };

  return (
    <>
      <h2 className="events-title">
        <Link to="/events" onClick={scrollToTop} className="events-title-link">
          رویدادها / کارگاه‌ها
        </Link>
      </h2>
      <div className="events">
        {slicedEventsData.map((element, i) => (
          <div className="event" key={i}>
            <h3
              onClick={() => showModal(element)}
              className={`event-sp-title  ${
                element.slug === "OPENDAY" ? "OPENDAY" : ""
              }`}
            >
              {element.title}
            </h3>
            <img
              // src={element.image}
              src={`/${element.slug}.jpg`}
              alt="event-img"
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() => showModal(element)}
              className="event-img"
            />
            <p className="event-detail">📍 {element.location}</p>
            <p className="event-detail">
              📆 شروع : {formatToPersianDate(element.start_event_at)}
            </p>
            <p className="event-detail">
              📆 پایان‌ : {formatToPersianDate(element.end_event_at)}
            </p>
            <p className="event-detail">💳 {element.price}</p>
          </div>
        ))}
      </div>
      <button className="events-more-button">
        <Link
          to="/events"
          onClick={scrollToTop}
          className="events-more-button-link"
        >
          بیشتر
        </Link>
      </button>
      <ModalAntd>
        <Modal
          title={
            <h4
              style={{
                direction: "rtl",
                marginTop: "2rem",
                marginBottom: "1.5rem",
                color: "var(--main-navy-blue)",
              }}
            >
              جزئیات رویداد
            </h4>
          }
          open={isModalOpen}
          // onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          footer={
            hasDateExpired(selected?.start_event_at)
              ? [
                  <p
                    key="expired"
                    style={{ marginBottom: "10px", color: "red" }}
                  >
                    !مهلت ثبت‌نام به پایان رسیده است
                  </p>,
                  <Button key="cancel" onClick={handleCancel}>
                    لغو
                  </Button>,
                ]
              : [
                  <Button key="cancel" onClick={handleCancel}>
                    لغو
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleOk}>
                    ثبت‌نام در رویداد
                  </Button>,
                ]
          }
        >
          <div className="modal-container">
            <p>توضیحات : {selected?.description}</p>
            {hasDateExpired(selected?.start_event_at) ? (
              ""
            ) : (
              <span
                style={{ color: "green", fontSize: "16px", fontWeight: "bold" }}
              >
                ظرفیت : {selected?.capacity} نفر
              </span>
            )}
          </div>
        </Modal>
      </ModalAntd>
    </>
  );
}
