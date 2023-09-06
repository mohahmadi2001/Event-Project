// import React, { useState, useEffect } from "react";
import logo from "./sciconnect.png";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth } from "./AuthContext";
import SearchBar from "./SearchBar";
import SignUpLoginComponent from "./SignUpLoginComponent";
import { Link } from "react-router-dom";

export default function NavigationBar() {
  const { isLoggedIn } = useAuth();

  //Implementing Sticky Nav Bar
  // const [isSticky, setIsSticky] = useState(false);
  // function handleSticky() {
  //   if (window.scrollY > 150) setIsSticky(true);
  //   else setIsSticky(false);
  // }

  // useEffect(() => {
  //   window.addEventListener("scroll", handleSticky);
  //   return () => {
  //     window.removeEventListener("scroll", handleSticky);
  //   };
  // }, []);
  //Scroll to Top of the Pages
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  //${isSticky ? "sticky" : ""}

  return (
    <Navbar expand="lg" className={`navbar`}>
      <Navbar.Brand href="#home" className="navbarBrand" onClick={scrollToTop}>
        <img src={logo} alt="sciconnect-logo" width={120} />
        SciConnect
      </Navbar.Brand>
      <SearchBar />
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto nav">
          <Nav.Link
            as={Link}
            to="/contact-us"
            className="navLink"
            onClick={scrollToTop}
          >
            تماس با ما
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/about-us"
            className="navLink"
            onClick={scrollToTop}
          >
            درباره ما
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/election"
            className="navLink"
            onClick={scrollToTop}
          >
            انتخابات
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/events"
            className="navLink"
            onClick={scrollToTop}
          >
            رویدادها / کارگاه‌ها
          </Nav.Link>

          <Nav.Link as={Link} to="/" className="navLink" onClick={scrollToTop}>
            خانه
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>

      {isLoggedIn && (
        <Nav.Link as={Link} to="/profile">
          <img src="/profile.png" alt="profile-icon" className="profile-icon" />
        </Nav.Link>
      )}

      <SignUpLoginComponent />
    </Navbar>
  );
}
