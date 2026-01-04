import React from "react";

// WIP - just a gradient for now
export default function AXShine(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1200" {...props}>
      <defs>
        {/* <!-- Metallic gradient --> */}
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d0d0d0" />
          <stop offset="45%" stop-color="#ffffff" />
          <stop offset="55%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#d0d0d0" />

          {/* <!-- Shine animation --> */}
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-2400 0"
            to="2400 0"
            dur="5s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>

      <path
        d="M 1200.00,-3.00
           C 1200.00,-3.00 0.00,1197.00 0.00,1197.00
             0.00,1197.00 200.00,1197.00 200.00,1197.00
             200.00,1197.00 747.00,645.00 747.00,645.00
             747.00,645.00 1563.00,645.00 1563.00,645.00
             1563.00,645.00 1000.00,1197.00 1000.00,1197.00
             1000.00,1197.00 1200.00,1197.00 1200.00,1197.00
             1200.00,1197.00 1700.00,697.00 1700.00,697.00
             1700.00,697.00 2200.00,1197.00 2200.00,1197.00
             2200.00,1197.00 2400.00,1197.00 2400.00,1197.00
             2400.00,1197.00 1800.00,597.00 1800.00,597.00
             1800.00,597.00 2400.00,-3.00 2400.00,-3.00
             2400.00,-3.00 2200.00,-3.00 2200.00,-3.00
             2200.00,-3.00 1700.00,497.00 1700.00,497.00
             1700.00,497.00 1200.00,-3.00 1200.00,-3.00M 1200.00,197.00
           C 1200.00,197.00 846.00,549.00 846.00,549.00
             846.00,549.00 1560.00,552.00 1560.00,552.00
             1560.00,552.00 1200.00,197.00 1200.00,197.00"
        fill="url(#metalGradient)"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
    </svg>
  );
}
