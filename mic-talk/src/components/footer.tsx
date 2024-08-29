import React from "react";

function Footer() {
  return (
<div className="flex flex-col xl:flex-row items-center justify-between h-auto xl:h-16 m-1 p-3.5">
  <div className="text-center text-gray-600 text-sm mb-2 xl:mb-0">
    &copy; 2024 Nowen Kottage. All code and design rights reserved.
  </div>
  <div className="text-center text-gray-600 mt-2 xl:mt-0">
    <a
      href="https://www.nowenkottage.com/"
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-center hover:border-transparent text-sm"
    >
      <p>Contact</p>
    </a>
  </div>
</div>

  );
}

export default Footer;
