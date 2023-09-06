import "./Election.css";
import { useEffect, useState } from "react";

export default function ParticipateElection() {
  const [appCandidates, setAppCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [isError, setIsError] = useState(false);
  // const [isVotted, setIsVotted] = useState(false); //useAuth to use it in profile
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
      const newSelectedCandidates = [...selectedCandidates, candidateId];
      setSelectedCandidates(newSelectedCandidates);

      // Check if selected candidates exceed half of the total candidates
      if (newSelectedCandidates.length > appCandidates.length / 2) {
        setIsError(true);
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

    // Create an object to send in the request body
    const voteData = {
      selectedCandidates: selectedCandidates,
    };
    console.log(voteData);

    // Make a POST request to your server
    fetch("http://localhost:8000/elections/vote/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Handle the response from the server if needed
        console.log("Vote submitted successfully:", data);
        //if submit vote ok: setIsVotted(true)
      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
        // Handle the error as needed
      });
  };

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
            {appCandidates.map((element) => (
              <>
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
                  style={{ width: "22px" }}
                  onChange={() => handleCandidateSelection(element.id)}
                  checked={selectedCandidates.includes(element.id)}
                  disabled={isError}
                />
              </>
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
