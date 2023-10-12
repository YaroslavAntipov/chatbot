"use client";
import React, { useEffect } from "react";
import Loader from "./Loader";
import ReactModal from "react-modal";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    border: "none",
    borderRadius: "8px",
    minWidth: "60%",
    opacity: 1,
  },
  overlay: {
    backgroundColor: "rgb(134, 134, 134, 0.6)",
    overflow: "hidden",
  },
};

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  onSave,
  children,
  isLoading,
}) => {
  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
    ReactModal.setAppElement(document.body);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ReactModal style={customStyles} isOpen={isOpen} onRequestClose={onClose}>
      <div className="bg-gray-600 min-w-[60%] px-8 py-4">
        {isLoading && <Loader fullSize={false} />}
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-400">
          <h3 className="text-xl font-semibold text-gray-300 mt-0.5">
            {title}
          </h3>
          <button
            type="button"
            onClick={() => onClose()}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {children}
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b border-gray-400">
          <button
            type="button"
            onClick={() => onSave()}
            className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Save
          </button>
          <button
            onClick={() => onClose()}
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default Modal;
