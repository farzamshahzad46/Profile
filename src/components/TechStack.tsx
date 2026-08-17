import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrainScene, { type Category, type Skill } from "./brainscene";
import "./skills-orbit.css";

// Edit these to change what appears in the network. Every skill's `category`
// must match one of the category ids below, or it falls back to the accent colour.
const categories: Category[] = [
  { id: "aiml", label: "AI / ML", color: "#7aa2ff" },
  { id: "genai", label: "GenAI & NLP", color: "#c58cff" },
  { id: "data", label: "Data & Analytics", color: "#5ddba4" },
  { id: "backend", label: "Backend & Databases", color: "#ff8fb0" },
  { id: "tools", label: "Tools & Platforms", color: "#ffc95c" },
];

const skills: Skill[] = [
  // AI / ML
  { name: "Machine Learning", category: "aiml" },
  { name: "Deep Learning", category: "aiml" },
  { name: "TensorFlow", category: "aiml" },
  { name: "Keras", category: "aiml" },
  { name: "Scikit-learn", category: "aiml" },
  { name: "XGBoost", category: "aiml" },
  { name: "LSTM / Time Series", category: "aiml" },
  { name: "OpenCV", category: "aiml" },
  { name: "Computer Vision", category: "aiml" },

  // GenAI & NLP
  { name: "NLP", category: "genai" },
  { name: "RAG Pipelines", category: "genai" },
  { name: "LangChain", category: "genai" },
  { name: "FAISS", category: "genai" },
  { name: "ChromaDB", category: "genai" },
  { name: "Embeddings", category: "genai" },
  { name: "Hybrid Search (BM25)", category: "genai" },
  { name: "Prompt Engineering", category: "genai" },
  { name: "LLM APIs", category: "genai" },

  // Data & Analytics
  { name: "Python", category: "data" },
  { name: "Pandas", category: "data" },
  { name: "NumPy", category: "data" },
  { name: "Power BI", category: "data" },
  { name: "Matplotlib", category: "data" },
  { name: "Feature Engineering", category: "data" },
  { name: "Data Cleaning", category: "data" },

  // Backend & Databases
  { name: "SQL", category: "backend" },
  { name: "MySQL", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "Flask", category: "backend" },
  { name: "Vector Databases", category: "backend" },

  // Tools & Platforms
  { name: "Git & GitHub", category: "tools" },
  { name: "Streamlit", category: "tools" },
  { name: "Jupyter", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "AWS (learning)", category: "tools" },
];

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouse: MutableRefObject<[number, number]> = useRef([0, 0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // TechStack loads lazily (behind Suspense) and adds a full 100vh block
    // to the page after Work's pinned ScrollTrigger has already been
    // measured. Without this, ScrollSmoother/ScrollTrigger keep using the
    // stale (shorter) page height, which makes this section collide with Work.
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouse.current = [x, -y];
    };
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const countFor = (id: string) => skills.filter((s) => s.category === id).length;

  return (
    <div className="techstack" id="techstack" ref={sectionRef}>
      <h2> My Techstack</h2>

      <div className="tech-canvas">
        <BrainScene
          mouse={mouse}
          skills={skills}
          categories={categories}
          activeCategory={activeCategory}
        />
      </div>

      <div className="tech-legend">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tech-pill ${activeCategory === cat.id ? "tech-pill-active" : ""}`}
            style={{ ["--pillColor" as string]: cat.color }}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            data-cursor="disable"
          >
            <span className="tech-pill-dot"></span>
            {cat.label}
            <span className="tech-pill-count">{countFor(cat.id)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TechStack;