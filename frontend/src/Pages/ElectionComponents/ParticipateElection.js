import "./Election.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ParticipateElection() {
  const [appCandidates, setAppCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isError, setIsError] = useState(false);
  const [electionInfo, setElectionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxVotePerUser, setMaxVotePerUser] = useState(0);

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
        setMaxVotePerUser(data[0].max_votes_per_user);
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
      if (selectedCandidates.length < maxVotePerUser) {
        // Check if selected candidates do not exceed the limit
        const newSelectedCandidates = [...selectedCandidates, candidateId];
        setSelectedCandidates(newSelectedCandidates);
      } else {
        toast.error(
          `شما نمی‌توانید بیش از ${maxVotePerUser} نفر را انتخاب کنید`,
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
      setIsError(false);
    }
  };

  //Handle Submit Vote
  const handleSubmitVote = () => {
    // Check if there are selected candidates
    if (selectedCandidates.length === 0) {
      // You can display an error message or handle it as needed
      return;
    }

    const electionId = 1;
    // Create an object to send in the request body
    const voteData = {
      election_id: electionId,
      candidate_ids: selectedCandidates,
    };
    console.log(voteData);

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
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          toast.success("رای شما با موفقیت ثبت شد", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.existerror) {
          toast.error("انتخابات وجود ندارد.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.activeerror) {
          toast.error("زمان انتخابات نیست.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.votederror) {
          toast.error("شما قبلا رای داده‌اید.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.studenterror) {
          toast.error("شما دانشجو نیستید.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
        if (data.maxerror) {
          toast.error(`حداقل می‌توانید به ${maxVotePerUser} نفر رای بدهید.`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Auto close after 2 seconds
          });
        }
      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
        // Handle the error as needed
      });
    setSelectedCandidates([]);
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
  const electionEndedAt = new Date(electionInfo[0]?.election_ended_at);

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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
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
