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

  const handleTopClick = (e) => {
    e.preventDefault();
    if (!localStorage.getItem("credentials")) {
      alert("ابتدا وارد سایت شوید.");
    } else {
      window.location.href = "/election/top-candidates";
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
      <div className="buttons" style={{ marginBottom: "40px" }}>
        <img src="/Picture3.png" alt="results" style={{ width: "120px" }} />
        <img
          src="/Picture5.png"
          alt="top-candidates"
          style={{ width: "170px" }}
        />

        <a
          className="button"
          href="/#"
          onClick={handleResultsClick}
          style={{ fontSize: "14px" }}
        >
          مشاهده نتایج انتخابات
        </a>
        <a className="button" href="/#" onClick={handleTopClick}>
          اعضای منتخب
        </a>
      </div>
    </div>
  );
}
