import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Machine Learning Intern</h4>
                <h5>Artificial Intelligence Community of Pakistan (AICP)</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Contributed to ML projects spanning classification, NLP, and regression tasks; standardized preprocessing pipelines reused across projects, cutting setup time on each new task. Applied supervised learning techniques, including feature engineering and cross-validation, on real-world datasets, improving model performance over baselines.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Computing and Data Science</h4>
                <h5>UMT, Lahore</h5>
              </div>
              <h3>2022-2026</h3>
            </div>
            <p>
              All coursework and Final Year Project completed; degree conferral November 2026. Built several AI/ML projects alongside my degree, covering machine learning, NLP, and computer vision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
