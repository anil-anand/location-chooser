import React from "react";

const Error = ({ code = 404 }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-code">{code}</h1>
        <p className="error-text">
          We're sorry, but the page you were looking for doesn't exist.
        </p>
        <a href="/" className="error-link">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default Error;
