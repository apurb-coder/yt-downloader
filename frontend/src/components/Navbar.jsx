import React from "react";
import { SiYoutube } from "react-icons/si";

const Navbar = () => {
  return (
    <>
      <nav className="flex p-4 md:p-6 bg-white">
        <div className="pl-2 md:pl-6 flex justify-center items-center space-x-2 text-xl md:text-2xl">
          <SiYoutube className="text-red-600" />
          <span className="text-gray-800 font-bold">YT Fetch</span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
