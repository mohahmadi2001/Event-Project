import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import Footer from "./Components/Footer";
import HomePageContainer from "./Pages/HomePageComponents/HomePageContainer";
import EventsContainer from "./Pages/EventsComponents/EventsContainer";
import AboutusContainer from "./Pages/AboutusComponents/AboutusContainer";
import ContactusContainer from "./Pages/ContactusComponents/ContactusContainer";
import ElectionContainer from "./Pages/ElectionComponents/ElectionContainer";
import ParticipateElection from "./Pages/ElectionComponents/ParticipateElection";
import RegisterCandidate from "./Pages/ElectionComponents/RegisterCandidate";
import Results from "./Pages/ElectionComponents/Results";
import Profile from "./Pages/ProfileComponents/Profile";
import "./index.css";

export default function App() {
  // Scroll to the top of the page in every reload (refresh)
  window.onload = function () {
    window.scrollTo(0, 0);
  };

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route exact path="/" element={<HomePageContainer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<EventsContainer />} />
        <Route path="/election" element={<ElectionContainer />} />
        <Route
          path="/election/participate-election"
          element={<ParticipateElection />}
        />
        <Route
          path="/election/register-candidate"
          element={<RegisterCandidate />}
        />
        <Route path="/election/results" element={<Results />} />

        <Route path="/about-us" element={<AboutusContainer />} />
        <Route path="/contact-us" element={<ContactusContainer />} />
      </Routes>
      <Footer />
    </Router>
  );
}
