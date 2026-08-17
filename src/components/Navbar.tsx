import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

// Sections mapped to the labels requested for the nav. "career" -> Experience,
// "techstack" -> Skills, "whatido" -> Services. These ids must exist on the
// corresponding section wrapper divs for smoother.scrollTo() to work.
const NAV_ITEMS = [
  { id: "about", label: "ABOUT" },
  { id: "work", label: "PROJECTS" },
  { id: "career", label: "EXPERIENCE" },
  { id: "techstack", label: "SKILLS" },
  { id: "whatido", label: "SERVICES" },
  { id: "contact", label: "CONTACT" },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a, .mobile-menu a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        setIsMenuOpen(false);
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });

    // Shrink the pill slightly once the page has scrolled a bit.
    ScrollTrigger.create({
      start: 80,
      end: 99999,
      onUpdate: (self) => setIsScrolled(self.scroll() > 80),
    });

    // Scroll-spy: highlight whichever section is currently in view.
    const spyTriggers = NAV_ITEMS.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveSection(id);
        },
      })
    );

    return () => {
      spyTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <a href="/#" className="navbar-title" data-cursor="disable">
          FS
        </a>
        <a
          href="mailto:FarzamShahzad27@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          FarzamShahzad27@gmail.com
        </a>
        <ul>
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                data-href={`#${id}`}
                href={`#${id}`}
                className={activeSection === id ? "nav-active" : ""}
              >
                <HoverLinks text={label} />
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`nav-burger ${isMenuOpen ? "nav-burger-open" : ""}`}
          aria-label="Toggle menu"
          data-cursor="disable"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-open" : ""}`}>
        <ul>
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                data-href={`#${id}`}
                href={`#${id}`}
                className={activeSection === id ? "nav-active" : ""}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`mobile-menu-backdrop ${isMenuOpen ? "mobile-menu-backdrop-open" : ""
          }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;