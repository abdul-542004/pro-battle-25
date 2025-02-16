import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 font-bold rounded-lg transition duration-300 shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;