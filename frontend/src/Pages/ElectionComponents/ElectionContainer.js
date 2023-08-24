import "./Election.css";

export default function Election() {
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

        <a className="button" href="/election/participate-election">
          شرکت در انتخابات
        </a>
        <a className="button" href="/election/register-candidate">
          ثبت‌نام کاندیدا
        </a>
      </div>
      <div className="buttons-2">
        <img src="/Picture3.png" alt="results" style={{ width: "120px" }} />
        <a className="button" href="/election/results">
          مشاهده نتایج انتخابات
        </a>
      </div>
    </div>
  );
}
