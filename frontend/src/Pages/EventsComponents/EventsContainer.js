import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ModalAntd } from "../../Components/ModalAntd";
import { Modal } from "antd";
import { Paginate } from "../../Components/Paginate";
import "./Events.css";

export default function EventsContainer() {
  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const [eventsData, setEventsData] = useState([]);

  //Implementing pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = eventsData.slice(startIndex, endIndex);
  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    scrollToTop();
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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //Fetching data from an API
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setEventsData(data); // Store the fetched data in state
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  // console.log(eventsData);

  return (
    <div className="events-container">
      <h2 className="events-title-sp">
        <Link to="/events" className="events-title-sp-link">
          رویدادها
        </Link>
      </h2>
      <div className="events-sp">
        {displayedData.map((element, i) => (
          <>
            <div className="event-sp" key={i}>
              <h3
                style={{ margin: "10px", fontSize: "25px", cursor: "pointer" }}
                onClick={() => showModal(element)}
              >
                {element.name.common}
              </h3>
              <img
                src={element.flags.png}
                alt="flag"
                style={{ width: "100%", cursor: "pointer" }}
                onClick={() => showModal(element)}
              />
            </div>
          </>
        ))}
      </div>
      <Paginate
        totalItems={eventsData.length}
        itemsPerPage={20}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
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
