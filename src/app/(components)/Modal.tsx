import React, { useEffect, useRef } from "react";

const Modal = ({ isVisible, onClose, children }) => {
  const modalRef = useRef<any>();

  useEffect(() => {
    const handleOutsideClick = (event: Event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      window.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible, onClose]);

  return (
    <div
      className={`bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-[200ms] ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div ref={modalRef} className="bg-ms-hbg p-2 rounded-xl shadow-lg relative">
        {children}
      </div>
    </div>
  );
};

export default Modal;
