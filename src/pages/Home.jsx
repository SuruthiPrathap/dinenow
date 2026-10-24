import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import TopNotch from "../components/TopNotch";
import Chef from "../components/Chef";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash
      ? location.hash.replace("#", "")
      : location.state && location.state.scrollTo;

    // no target: open Home at the top
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }

    // try for up to 2 seconds until the section is on the page
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      tries++;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
        clearInterval(timer);
      } else if (tries > 20) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [location]);

  return (
    <div>
      <Hero />
      <Reveal direction="up">
        <About />
      </Reveal>
      <TopNotch />
      <Reveal direction="up">
        <Chef />
      </Reveal>
      <Reveal direction="up">
        <Footer />
      </Reveal>
    </div>
  );
}

export default Home;