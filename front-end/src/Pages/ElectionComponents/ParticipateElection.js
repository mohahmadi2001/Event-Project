import "./Election.css";

export default function ParticipateElection() {
  return (
    <>
      <div className="election-container">
        <h2 className="participate-title">شرکت در انتخابات</h2>
        <h5 className="participate-title">
          انتخابات انجمن علمی مهندسی کامپیوتر دانشگاه اصفهان
        </h5>
        <h5 className="participate-title">اسامی کاندیداها:</h5>
      </div>
      <div className="button-submit-wrapper">
        <button className="button-submit">ثبت رای</button>
      </div>
    </>
  );
}
