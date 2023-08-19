import Carousel from "react-bootstrap/Carousel";

export default function CarouselComponent() {
  return (
    <div className="carousel-wrapper">
      <Carousel>
        <Carousel.Item>
          <img src="python.jpg" alt="First slide" className="carousel-img" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="Tedx.jpg" alt="Second slide" className="carousel-img" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="network.jpg" alt="Third slide" className="carousel-img" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
