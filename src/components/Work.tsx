import "./styles/Work.css";
import { MdArrowOutward } from "react-icons/md";

// This section is intentionally static: no pinning, no horizontal scrub.
// The project cards lay out as a normal responsive grid and the page scrolls
// past them like any other section.
const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[
            {
              name: "AI Search Engine with RAG",
              category: "NLP / AI",
              description:
                "A retrieval-augmented search pipeline that answers natural-language questions with source-backed results instead of a plain link list. Combines semantic vector retrieval over an embedded document corpus with an LLM response layer, so answers stay grounded in retrieved context rather than model memory.",
              tools: "Python, LangChain, Vector DB, LLM APIs",
              link: "https://github.com/farzamshahzad46"
            },
            {
              name: "Document Q&A Chatbot (RAG)",
              category: "NLP / AI",
              description:
                "Upload a PDF or text document and ask questions about its contents. Documents are chunked, embedded and stored in a vector index, then the closest passages are retrieved per question and passed to the model as context - which keeps answers tied to the source file and makes them traceable back to it.",
              tools: "Python, LangChain, FAISS / ChromaDB, Embeddings",
            },
            {
              name: "Deepfake Voice Detection System",
              category: "Machine Learning",
              description:
                "Classifies whether a voice recording is genuine or AI-generated, using two signal sources rather than one: MFCC acoustic features extracted with Librosa, plus TF-IDF features from a Whisper transcript of the same audio. Both feed an XGBoost classifier, wrapped in a Streamlit interface for uploading and testing clips.",
              tools: "Python, Librosa, Whisper, TF-IDF, XGBoost, Streamlit",
              link: "https://github.com/farzamshahzad46/Deep-Fake-Voice-Detection"
            },
            {
              name: "Highway Vehicle Detection",
              category: "Computer Vision",
              description:
                "Detects and boxes vehicles in highway images and video footage using a custom-trained Haar Cascade classifier in OpenCV. A deliberately classical computer-vision approach - no neural network - which makes it lightweight enough to run on CPU in real time, at the cost of the robustness a modern detector would give.",
              tools: "Python, OpenCV, Haar Cascade Classifier",
              link: "https://github.com/farzamshahzad46/Highway-car-Detection"
            },
            {
              name: "Medical Assistant Chatbot",
              category: "NLP / Healthcare",
              description:
                "Takes a description of symptoms and returns general, non-diagnostic health guidance, then generates a downloadable PDF summarising the session and suggested next steps. Built as an NLP exercise in structuring free-text medical input into a consistent, shareable output document.",
              tools: "Python, NLP, PDF Generation",
              link: "https://github.com/farzamshahzad46/Medical-Assistant-Chatbot"
            },
            {
              name: "Stock Price Forecasting (LSTM)",
              category: "Deep Learning",
              description:
                "An LSTM recurrent network trained on multi-year historical price data to forecast short-term trend direction. Covers the full time-series workflow - normalisation, windowed sequence construction, train/test splitting that respects chronological order, and evaluation against a naive baseline to check the model actually adds signal.",
              tools: "Python, TensorFlow, Keras, Pandas, NumPy",
            }
          ].map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p className="work-description">{project.description}</p>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                {project.link && (
                  <a
                    className="work-repo-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                  >
                    View on GitHub <MdArrowOutward />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;