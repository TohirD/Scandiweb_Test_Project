import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div className="error-message">{message}</div>
);

export default ErrorMessage;
