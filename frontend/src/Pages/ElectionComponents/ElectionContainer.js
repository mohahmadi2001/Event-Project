import "./Election.css";

export default function Election() {
  // Check if the user is logged in
  const handleParticipateClick = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("credentials")) {
      alert("ابتدا وارد سایت شوید.");
    } else {
      window.location.href = "/election/participate-election";
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("credentials")) {
      alert("ابتدا وارد سایت شوید.");
    } else {
      window.location.href = "/election/register-candidate";
    }
  };

  const handleResultsClick = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("credentials")) {
      alert("ابتدا وارد سایت شوید.");
    } else {
      window.location.href = "/election/results";
    }
  };

  return (
    <div className="election-container">
      <h2 className="election-title-sp">انتخابات</h2>
      <div className="buttons" style={{ marginBottom: "20px" }}>
        <img
          src="/Picture1.png"
          alt="participate-election"
          style={{ width: "100px" }}
        />
        <img
          src="/Picture4.png"
          alt="register-candidate"
          style={{ width: "120px" }}
        />

        <a className="button" href="/#" onClick={handleParticipateClick}>
          شرکت در انتخابات
        </a>
        <a className="button" href="/#" onClick={handleRegisterClick}>
          ثبت‌نام کاندیدا
        </a>
      </div>
      <div className="buttons-2">
        <img src="/Picture3.png" alt="results" style={{ width: "120px" }} />
        <a className="button" href="/#" onClick={handleResultsClick}>
          مشاهده نتایج انتخابات
        </a>
      </div>
    </div>
  );
}
