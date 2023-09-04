import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ModalAntd } from "../../Components/ModalAntd";
import jalaliMoment from "jalali-moment";
import { Modal, Button } from "antd";

export default function Events() {
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  //Implementing antd modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  function showModal(el) {
    setSelected(el);
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
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
