import CarouselComponent from "./CarouselComponent";
import Events from "./Events.js";
import "./HomePage.css";

export default function HomePageContainer() {
  return (
    <div className="homepage-container">
      <CarouselComponent />
      <Events />
    </div>
  );
}
