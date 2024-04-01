import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosCloudDownload } from "react-icons/io";
import { SiYoutube } from "react-icons/si";
import axios from 'axios';

const InputBar = () => {
  const navigate =  useNavigate();
  const handleSubmit =()=>{
    navigate("/download");
  }
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] lg:h-[89vh] mx-auto">
      <div className="flex  items-center space-x-1 text-3xl lg:text-5xl mb-10">
        <SiYoutube className="text-red-600" />
        {"  "}
        <span className=" text-red-600 font-bold">YouTube</span>
        <span className=" text-gray-700 font-bold">Downloader</span>
      </div>
      <div className="flex justify-center items-center space-x-5">
        <input
          type="text"
          name="ytlink"
          id="ytlink"
          placeholder="Paste your video link here"
          className="p-4  lg:w-[30rem] rounded-md border-2 border-neutral-400/50 focus:outline-none text-xs lg:text-sm"
        />
        <button
          class="relative inline-block text-sm lg:text-lg group w-[8.5rem] lg:w-[10rem]"
          onClick={handleSubmit}
        >
          <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-red-600 transition-colors duration-300 ease-out border-2 border-red-700 rounded-lg group-hover:text-white">
            <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
            <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-700 group-hover:-rotate-180 ease"></span>
            <span class="relative flex items-center justify-center">
              Download{" "}
              <IoIosCloudDownload className="ml-3 text-red-600 group-hover:text-white" />
            </span>
          </span>
          <span
            class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-red-600 rounded-lg group-hover:mb-0 group-hover:mr-0"
            data-rounded="rounded-lg"
          ></span>
        </button>
      </div>
    </div>
  );
}

export default InputBar