import React from "react";
import { SiYoutube } from "react-icons/si";

const Navbar = () => {
  return (
    <>
      <nav className="flex p-5 shadow-sm">
        <div className="pl-5 flex justify-center items-center space-x-1">
          <SiYoutube className="text-red-600"/>{"  "}
          <span className=" text-red-600 font-bold">YouTube</span>
          <span className=" text-gray-700 font-bold">Downloader</span>
        </div>
        <div></div>
      </nav>
    </>
  );
};

export default Navbar;
