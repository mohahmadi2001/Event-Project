import "./Election.css";

export default function Election() {
  return (
    <div className="election-container">
      <h2 className="election-title-sp">انتخابات</h2>
      <div className="buttons" style={{ marginBottom: "20px" }}>
        <a className="button" href="/election/participate-election">
          شرکت در انتخابات
        </a>
        <a className="button" href="/election/register-candidate">
          ثبت‌نام کاندیدا
        </a>
      </div>
      <div className="buttons">
        <a className="button" href="/election/results">
          مشاهده نتایج انتخابات
        </a>
      </div>
    </div>
  );
}
