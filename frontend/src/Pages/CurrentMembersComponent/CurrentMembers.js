import "./CurrentMembers.css";
import React, { useState, useEffect } from "react";

export default function CurrentMembers() {
  const [currentMembers, setCurrentMembers] = useState([]);
  const [electionInfo, setElectionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ex, setEx] = useState([]);
  //Fetch Staff (!)
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    fetch("http://localhost:8000/auth/staff-users/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setEx(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
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

  //Fetch current members names
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    fetch("http://localhost:8000/elections/top-candidates/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setCurrentMembers(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

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
      <div
        style={{
          display: "grid",
          justifyItems: "end",
          alignItems: "start",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <div>
          <img
            src="/Happy students or pupils watching study webinar_prev_ui.png"
            alt="fantasy"
          />
        </div>
        <div className="current-members-container">
          <h5
            className="current-members-title"
            style={{ marginBottom: "30px" }}
          >
            اعضای سابق انجمن
          </h5>
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                justifyItems: "center",
                marginRight: "7rem",
                fontSize: "20px",
                columnGap: "2rem",
              }}
            >
              {ex.map((element, i) => (
                <React.Fragment key={i}>
                  <p>ورودی {element.student_entry_year}</p>
                  <p>
                    {`${element.first_name} `}
                    {element.last_name}
                  </p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        justifyItems: "end",
        alignItems: "start",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}
    >
      <div>
        <img
          src="/Happy students or pupils watching study webinar_prev_ui.png"
          alt="fantasy"
        />
      </div>
      <div className="current-members-container">
        <h2 className="current-members-title">اعضای انجمن علمی</h2>
        <div className="content-container">
          <div className="current-members">
            {currentMembers.map((element, i) => (
              <React.Fragment key={i}>
                <p>ورودی {element.entry_year}</p>
                <p>
                  {`${element.first_name} `}
                  {element.last_name}
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
