import "./Election.css";
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function Results() {
  const [electionInfo, setElectionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const [results, setResults] = useState([]);
  //Fetch election results
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    fetch("http://localhost:8000/elections/results/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setResults(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Fetch student status
  const [totalParticipants, setTotalParticipants] = useState([]);
  useEffect(() => {
    const base64Credentials = localStorage.getItem("credentials");
    const headers = {
      "Content-Type": "application/json",
    };

    if (base64Credentials) {
      // headers.Authorization = `Token ${authToken}`;
      headers.Authorization = `Basic ${base64Credentials}`;
    }
    fetch("http://localhost:8000/auth/students/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setTotalParticipants(
          data.filter((element) => element.has_voted).length
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //Display results using highcharts
  const columnData = results.map((element) => ({
    name: `${element.first_name} ${element.last_name}`,
    y: element.votes_count,
  }));

  const options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Kalameh",
      },
    },
    title: {
      text: "نتایج انتخابات",
      style: {
        color: "var(--main-navy-blue)",
      },
    },
    xAxis: {
      categories: columnData.map((element) => element.name),
      labels: {
        style: {
          fontSize: "14px",
        },
      },
      title: {
        text: "اسامی کاندیدا",
        style: {
          fontSize: "18px",
        },
      },
    },
    yAxis: {
      title: {
        text: "تعداد رای‌ها",
        style: {
          fontSize: "18px",
        },
      },
      allowDecimals: false,
    },
    plotOptions: {
      column: {
        pointWidth: 70,
      },
    },
    series: [
      {
        name: "رای‌ها",
        data: columnData.map((element) => element.y),
        colorByPoint: true,
        dataLabels: {
          enabled: true,
        },
      },
    ],
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

  if (now > electionStartedAt && now < electionEndedAt) {
    return (
      <div className="election-container">
        <h5 style={{ color: "red", textAlign: "center" }}>
          انتخابات هنوز به پایان نرسیده است!
        </h5>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src="/4867780_prev_ui.png" alt="time-expire" />
        </div>
      </div>
    );
  }

  return (
    <div className="election-container">
      <h2 className="results-title" style={{ marginBottom: "30px" }}>
        نتایج انتخابات
      </h2>
      <h6 className="results-title">
        تعداد کل شرکت‌کنندگان: {totalParticipants} نفر
      </h6>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          rowGap: "20px",
          marginRight: "8rem",
          marginLeft: "55rem",
        }}
      >
        {results.map((element, i) => (
          <React.Fragment key={i}>
            <p>
              {`${element.first_name} `}
              {`${element.last_name} `}
            </p>
            <p>{element.votes_count} رای</p>
          </React.Fragment>
        ))}
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options} //
      />
    </div>
  );
}
