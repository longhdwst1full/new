
import React from 'react';

 

export const SendButton = ({ onPress, disabled } ) => {
  return (
    <button disabled={disabled} onClick={onPress}>
      Send
    </button>
  );
};
