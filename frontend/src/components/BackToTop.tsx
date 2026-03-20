import { useState, useEffect } from "react";
import { BsCaretUpSquareFill } from "react-icons/bs";

const FOOTER_HEIGHT = 320;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [inFooter, setInFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      setVisible(scrollY > 300);
      setInFooter(scrollY + windowH >= docH - FOOTER_HEIGHT + 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="hidden md:block"
      style={{
        position: 'fixed',
        right: '30px',
        bottom: '40px',
        zIndex: 40,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.8s ease',
      }}
    >
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <BsCaretUpSquareFill style={{
          color: inFooter ? '#BFA57A' : '#1A1A1A',
          width: '36px',
          height: '36px',
          filter: inFooter ? 'none' : 'drop-shadow(0 0 2px #fff)',
          transition: 'color 0.8s ease, filter 0.8s ease',
        }} />
      </button>
    </div>
  );
};

export default BackToTop;