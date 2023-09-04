import "./Election.css";
import { useEffect } from "react";

export default function ParticipateElection() {
  //Fetching candidates' data from api
  useEffect(() => {
    fetch("http://localhost:8000/elections/approved-candidates/")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log(data); // Store the fetched data in state
      })
      .catch((error) => console.error("Error:", error));
  }, []);
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
              rowGap: "15px",
            }}
          >
            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۱
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۲
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۳
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۴
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۵
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۶
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۷
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۸
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۹
            </label>
            <input type="checkbox" style={{ width: "22px" }} />

            <label style={{ fontSize: "18px", marginRight: "7rem" }}>
              کاندیدای ۱۰
            </label>
            <input type="checkbox" style={{ width: "22px" }} />
          </div>
        </div>
      </div>
      <div className="button-submit-wrapper">
        <button className="button-submit">ثبت رای</button>
      </div>
    </>
  );
}
