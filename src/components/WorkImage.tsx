import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
  category?: string;
}

// Simple deterministic hash so each project gets a consistent (not random)
// accent pattern across renders, without needing a real screenshot.
const hashStr = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const PlaceholderCard = ({ name, category }: { name: string; category?: string }) => {
  const seed = hashStr(name);
  const offset = (seed % 40) - 20; // -20..20, varies the diagonal lines per card

  return (
    <svg
      viewBox="0 0 600 350"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <rect width="600" height="350" fill="#171b12" />
      <rect x="0.5" y="0.5" width="599" height="349" fill="none" stroke="rgba(223,255,91,0.12)" />
      {[...Array(6)].map((_, i) => (
        <line
          key={i}
          x1={i * 110 + offset}
          y1="0"
          x2={i * 110 + offset + 140}
          y2="350"
          stroke="rgba(223,255,91,0.05)"
          strokeWidth="1"
        />
      ))}
      <circle cx="300" cy="150" r="34" fill="none" stroke="#dfff5b" strokeWidth="1.4" opacity="0.7" />
      <circle cx="300" cy="150" r="4" fill="#dfff5b" />
      {category && (
        <text
          x="300"
          y="215"
          textAnchor="middle"
          fill="#a4aa9d"
          fontSize="12"
          fontFamily="Geist, sans-serif"
          letterSpacing="2"
        >
          {category.toUpperCase()}
        </text>
      )}
      <text
        x="300"
        y="245"
        textAnchor="middle"
        fill="#f2f3ee"
        fontSize="22"
        fontFamily="'Instrument Serif', serif"
      >
        {name}
      </text>
      <text
        x="300"
        y="270"
        textAnchor="middle"
        fill="#a4aa9d"
        fontSize="11"
        fontFamily="Geist, sans-serif"
        letterSpacing="1.5"
      >
        PREVIEW COMING SOON
      </text>
    </svg>
  );
};

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        {props.image ? (
          <img src={props.image} alt={props.alt} />
        ) : (
          <PlaceholderCard name={props.alt || "Project"} category={props.category} />
        )}
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;