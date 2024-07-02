import * as React from "react";

export const MessageInput = ({ value, onValueChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      placeholder="Send a message"
    />
  );
};
