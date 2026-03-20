import { useState, useRef } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeout.current = setTimeout(() => setVisible(true), 100);
  };

  const hide = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setVisible(false);
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-70%)" },
    bottom: { top:    "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right:  "calc(100% + 8px)", top:  "50%", transform: "translateY(-50%)" },
    right:  { left:   "calc(100% + 8px)", top:  "50%", transform: "translateY(-50%)" },
  };

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}

      <div
        style={{
          position: "absolute",
          ...positionStyles[position],
          backgroundColor: "#BFA57A",
          color: "#FAF7F3",
          fontSize: "0.75rem",
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          padding: "8px 14px",
          borderRadius: "10px",
                    minWidth: "70px",
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          zIndex: 50,
        }}
      >
        {text}
        {/* Arrow */}
        <div style={{
          position: "absolute",
          ...(position === "top" ? { top: "100%", left: "71%", transform: "translateX(-50%)", borderTop:    "5px solid #BFA57A", borderLeft: "5px solid transparent", borderRight: "5px solid transparent" } : {}),
          ...(position === "bottom" ? { bottom: "100%", left: "60%", transform: "translateX(-40%)", borderBottom: "5px solid #BFA57A", borderLeft: "5px solid transparent", borderRight: "5px solid transparent" } : {}),
          ...(position === "left"   ? { left: "100%",  top:  "50%", transform: "translateY(-50%)", borderLeft:   "5px solid #BFA57A", borderTop:  "5px solid transparent", borderBottom: "5px solid transparent" } : {}),
          ...(position === "right"  ? { right: "100%", top:  "50%", transform: "translateY(-50%)", borderRight:  "5px solid #BFA57A", borderTop:  "5px solid transparent", borderBottom: "5px solid transparent" } : {}),
        }} />
      </div>
    </div>
  );
}