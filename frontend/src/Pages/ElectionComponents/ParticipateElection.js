import "./Election.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import moment from "jalali-moment";

export default function ParticipateElection() {
  const [appCandidates, setAppCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isError, setIsError] = useState(false);
  const [electionInfo, setElectionInfo] = useState([]);
  const [status, setStatus] = useState({});
  const [remainingTime, setRemainingTime] = useState("");
  const [loading, setLoading] = useState(true);

  //Countdown
  const electionEndedAt = new Date(electionInfo[0]?.election_ended_at);
  const calculateRemainingTime = () => {
    const now = moment();
    const endDate = moment(electionEndedAt, "YYYY-MM-DDTHH:mm:ssZ");
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
  }, [electionEndedAt]);

  //Fetch election status (remaining time)
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    fetch("http://localhost:8000/elections/status/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setStatus(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Fetch election info
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

  //Fetching candidates' data from api
  useEffect(() => {
    fetch("http://localhost:8000/elections/approved-candidates/")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setAppCandidates(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Handler for candidate selection
  const handleCandidateSelection = (candidateId) => {
    const candidateIndex = selectedCandidates.indexOf(candidateId);
    if (candidateIndex === -1) {
      // Candidate is not selected, add to selectedCandidates
      if (selectedCandidates.length < electionInfo[0].max_votes_per_user) {
        // Check if selected candidates do not exceed the limit
        const newSelectedCandidates = [...selectedCandidates, candidateId];
        setSelectedCandidates(newSelectedCandidates);
      } else {
        toast.error(
          `شما نمی‌توانید بیش از ${electionInfo[0].max_votes_per_user} نفر را انتخاب کنید`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          }
        );
      }
    } else {
      // Candidate is already selected, remove from selectedCandidates
      const newSelectedCandidates = selectedCandidates.filter(
        (id) => id !== candidateId
      );
      setSelectedCandidates(newSelectedCandidates);
    }
  };

  //Handle Submit Vote
  const handleSubmitVote = () => {
    // Check if there are selected candidates
    if (selectedCandidates.length === 0) {
      // You can display an error message or handle it as needed
      alert("کاندیدی را انتخاب نکرده‌اید!");
      return;
    }

    const electionId = 1;

    // Create an object to send in the request body
    const voteData = {
      election_id: electionId,
      candidate_ids: selectedCandidates,
    };
    // console.log(voteData);

    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }

    // Make a POST request to your server
    fetch("http://localhost:8000/elections/vote/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(voteData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          toast.success("رای شما با موفقیت ثبت شد", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
          setSelectedCandidates([]);
        } else if (data.votederror) {
          toast.error(".شما قبلا رای داده‌اید", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
          setSelectedCandidates([]);
        } else if (data.maxerror) {
          toast.error(
            `شما نمی‌توانید بیش از ${electionInfo.max_votes_per_user} .کاندید انتخاب کنید`,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 5000, // Auto close after 5 seconds
            }
          );
          setSelectedCandidates([]);
        } else if (data.activeerror) {
          toast.error("انتخابات فعال نیست یا هنوز شروع نشده است.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
          setSelectedCandidates([]);
        } else if (data.existerror) {
          toast.error("انتخابات وجو ندارد.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
          setSelectedCandidates([]);
        } else if (data.studenterror) {
          toast.error("شما دانشجو نیستید.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 5 seconds
          });
          setSelectedCandidates([]);
        }
      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
        // Handle the error as needed
      });
  };

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

  if (now < electionStartedAt || now > electionEndedAt) {
    return (
      <div className="election-container">
        <h5 style={{ color: "red", textAlign: "center" }}>
          زمان انتخابات نیست!
        </h5>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="/4867780_prev_ui.png" alt="time-expire" />
        </div>
      </div>
    );
  }

  return (
    <>
      <p style={{ direction: "rtl", textAlign: "center", color: "red" }}>
        زمان باقی مانده تا پایان انتخابات: {remainingTime}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <img
            src="/Hand putting voting bulletin into box.png"
            alt="fantasy"
            style={{
              width: "500px",
              height: "500px",
              marginRight: "15rem",
              marginTop: "6rem",
            }}
          />
        </div>
        <div className="election-container">
          <h2 className="participate-title">شرکت در انتخابات</h2>
          <h5 className="participate-title">
            انتخابات انجمن علمی مهندسی کامپیوتر دانشگاه اصفهان
          </h5>
          <h5 className="participate-title" style={{ marginBottom: "20px" }}>
            اسامی کاندیداها:
          </h5>
          <div
            className="candidate-names"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              rowGap: "20px",
              columnGap: "20px",
              marginBottom: "40px",
            }}
          >
            {appCandidates.map((element, i) => (
              <React.Fragment key={i}>
                <label
                  style={{
                    fontSize: "18px",
                    marginRight: "7rem",
                    width: "250px",
                  }}
                >
                  {`${element.first_name} `}
                  {`${element.last_name} `}
                  (ورودی{element.entry_year})
                </label>
                <input
                  type="checkbox"
                  style={{
                    width: "22px",
                    accentColor: "var(--main-navy-blue)",
                  }}
                  onChange={() => handleCandidateSelection(element.id)}
                  checked={selectedCandidates.includes(element.id)}
                  disabled={isError}
                  className="checkbox"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="button-submit-wrapper">
        <button className="button-submit" onClick={handleSubmitVote}>
          ثبت رای
        </button>
      </div>
    </>
  );
}
