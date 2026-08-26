import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

const MENU_WIDTH = 144; // matches w-36 (36 * 4px)

export function ActionMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: rect.left + rect.width / 2 - MENU_WIDTH / 2,
    });
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton = buttonRef.current?.contains(e.target);
      const clickedMenu = menuRef.current?.contains(e.target);
      if (!clickedButton && !clickedMenu) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        className="rounded-md p-1.5 text-text-secondary hover:bg-surface hover:text-text-primary"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 w-36 rounded-md border border-border bg-card py-1 shadow-lg"
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}

export function ActionMenuItem({ children, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface ${
        danger ? "text-danger" : "text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}