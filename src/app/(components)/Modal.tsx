import React from "react";
import { IconButton } from "@material-tailwind/react";

const Modal = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-ms-hbg p-2 rounded-xl shadow-lg relative">{children}</div>
    </div>
  );
};

export default Modal;
