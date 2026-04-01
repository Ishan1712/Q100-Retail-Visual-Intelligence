import React from 'react';
import './Tooltip.css';

export default function Tooltip({ text, children, position = 'top' }) {
  if (!text) return children;
  return (
    <span className={`q-tooltip-wrap q-tooltip-${position}`} data-tooltip={text}>
      {children}
    </span>
  );
}
