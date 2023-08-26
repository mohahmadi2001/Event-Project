import { Link } from "react-router-dom";
import { useState } from "react";
import { ModalAntd } from "../../Components/ModalAntd";
import { Modal } from "antd";
import "./Events.css";

export default function EventsContainer() {
  const [eventsData, setEventsData] = useState([]);

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

  fetch("http://localhost:8000/events/")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      setEventsData(data); // Store the fetched data in state
    })
    .catch((error) => console.error("Error:", error));

  return (
    <div className="events-container">
      <h2 className="events-title-sp">
        <Link to="/events" className="events-title-sp-link">
          رویدادها
        </Link>
      </h2>
      <div className="events-sp">
        {eventsData.map((element, i) => (
          <>
            <div className="event-sp" key={i}>
              <h3
                style={{ margin: "10px", fontSize: "25px", cursor: "pointer" }}
                onClick={() => showModal(element)}
              >
                {element.title}
              </h3>
              {/* <img
                src={element.image}
                alt="event-img"
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => showModal(element)}
              /> */}
            </div>
          </>
        ))}
      </div>
      <ModalAntd>
        <Modal
          title={
            <h4
              style={{
                direction: "rtl",
                marginTop: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              جزئیات رویداد
            </h4>
          }
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="ثبت‌نام در رویداد"
          cancelText="لغو"
        >
          <div className="modal-container" style={{ direction: "rtl" }}>
            <h5>
              {selected && (selected.fifa ? selected.fifa : "وجود ندارد!")}
            </h5>
          </div>
        </Modal>
      </ModalAntd>
    </div>
  );
}
