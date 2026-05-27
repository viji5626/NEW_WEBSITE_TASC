import React from 'react';

const Logo = ({ className = "" }: { className?: string }) => (
  <img
    src="/brand/tasc-logo-dark.png"
    alt="TASC — Tenacious Automation Solutions & Consulting"
    width={132}
    height={52}
    className={`select-none ${className}`}
    style={{ height: 44, width: "auto", display: "block" }}
    draggable={false}
  />
);

export default Logo;
