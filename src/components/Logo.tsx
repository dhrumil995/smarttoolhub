import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      {/* Outer Glow or shadow for dark/light contrast */}
      <circle cx="100" cy="110" r="75" fill="black" fillOpacity="0.04" className="dark:fill-white/5 transition-colors duration-200" />

      {/* --- EARS --- */}
      {/* Left Ear Outer */}
      <path
        d="M 68 75 C 68 25, 74 15, 84 15 C 94 15, 96 25, 96 75 Z"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Left Ear Inner (Cream) */}
      <path
        d="M 74 75 C 74 35, 78 25, 84 25 C 90 25, 90 35, 90 75 Z"
        fill="#FFEFC4"
      />

      {/* Right Ear Outer */}
      <path
        d="M 104 75 C 104 25, 106 15, 116 15 C 126 15, 132 25, 132 75 Z"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Right Ear Inner (Cream) */}
      <path
        d="M 110 75 C 110 35, 114 25, 116 25 C 118 25, 122 35, 122 75 Z"
        fill="#FFEFC4"
      />

      {/* --- FLUFFY HEAD BODY (Spiky silhouette) --- */}
      <path
        d="M 100 56 
           C 112 56, 122 58, 130 63 
           C 136 58, 145 61, 147 70 
           C 154 71, 158 78, 156 86 
           C 162 88, 164 96, 160 103 
           C 164 107, 163 117, 157 122 
           C 160 128, 156 136, 149 138 
           C 146 144, 138 147, 131 146 
           C 123 151, 112 153, 100 153 
           C 88 153, 77 151, 69 146 
           C 62 147, 54 144, 51 138 
           C 44 136, 40 128, 43 122 
           C 37 117, 36 107, 40 103 
           C 36 96, 38 88, 44 86 
           C 42 78, 46 71, 53 70 
           C 55 61, 64 58, 70 63 
           C 78 58, 88 56, 100 56 Z"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* --- BEIGE/CREAM FACE PLATE --- */}
      <path
        d="M 54 110 
           C 50 82, 150 82, 146 110 
           C 144 136, 56 136, 54 110 Z"
        fill="#FFEFC4"
        stroke="#2E2D30"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* --- NOSE (Red) --- */}
      <circle cx="100" cy="116" r="6.5" fill="#E03E3E" stroke="#2E2D30" strokeWidth="2.5" />

      {/* --- EYES (Orange Stars) --- */}
      {/* Left Star Eye */}
      <polygon
        points="78,94 81.5,103 91,104 83.5,111 86,120 78,115 70,120 72.5,111 65,104 74.5,103"
        fill="#E86A2E"
        stroke="#2E2D30"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Right Star Eye */}
      <polygon
        points="122,94 125.5,103 135,104 127.5,111 130,120 122,115 114,120 116.5,111 109,104 118.5,103"
        fill="#E86A2E"
        stroke="#2E2D30"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* --- MOUTH (Smile + Tiny Cute Teeth) --- */}
      <path
        d="M 72 125 C 80 142, 120 142, 128 125"
        stroke="#2E2D30"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Teeth / Fangs */}
      <path
        d="M 85 129 L 88 135 L 92 130"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M 115 129 L 112 135 L 108 130"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* --- ORANGE SHIELD / QUESTION SPHERE --- */}
      {/* The big orange circle at bottom */}
      <circle
        cx="100"
        cy="158"
        r="28"
        fill="#E86A2E"
        stroke="#2E2D30"
        strokeWidth="5.5"
      />

      {/* Question mark centered in orange sphere */}
      <text
        x="100"
        y="170"
        fill="#FFEFC4"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="34"
        textAnchor="middle"
        className="select-none pointer-events-none"
      >
        ?
      </text>

      {/* --- CUTE HANDS / PAWS --- */}
      {/* Left Paw holding the orange sphere */}
      <circle
        cx="74"
        cy="156"
        r="9"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="1.5"
      />
      {/* Right Paw holding the orange sphere */}
      <circle
        cx="126"
        cy="156"
        r="9"
        fill="#2E2D30"
        stroke="#2E2D30"
        strokeWidth="1.5"
      />
    </svg>
  );
}
