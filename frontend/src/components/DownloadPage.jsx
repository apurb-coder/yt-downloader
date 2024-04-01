import React from 'react'
import { IoIosCloudDownload } from "react-icons/io";
import sampleThumbline from "../assets/sampleThumbline.jpg"
import Select from "react-select";

const DownloadPage = () => {
  // customStyles is an object that defines styles for the option elements
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderWidth: "2px",
      borderColor: "rgba(107, 114, 128, 0.5)",
      outline: "none",
    }),
  };
  return (
    <div className="flex justify-center items-center h-[100vh] lg:h-[89vh] mx-auto">
      <div className="flex flex-col justify-center items-center border-2 border-gray-700/50 rounded-md px-5 py-10 w-[80%] lg:w-[50%]">
        <div className="flex justify-between lg:justify-around items-center w-full flex-col lg:flex-row">
          <img
            src={sampleThumbline}
            alt="thumbline"
            className="w-[20rem] h-[11.25rem] rounded-lg"
          />
          <select
            name="videoQuality"
            id="videoQuality"
            className="w-[10rem] h-[3rem] rounded-lg border-2 border-gray-700/50 outline-none mt-7 lg:mt-0"
          >
            <option value="1080p">1080p</option>
            <option value="1080p">1080p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>
        <button className="relative inline-block text-sm lg:text-lg group w-[8.5rem] lg:w-[10rem] mt-7 lg:mt-16">
          <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-red-600 transition-colors duration-300 ease-out border-2 border-red-700 rounded-lg group-hover:text-white">
            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
            <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-700 group-hover:-rotate-180 ease"></span>
            <span className="relative flex items-center justify-center">
              Download{" "}
              <IoIosCloudDownload className="ml-3 text-red-600 group-hover:text-white" />
            </span>
          </span>
          <span
            className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-red-600 rounded-lg group-hover:mb-0 group-hover:mr-0"
            data-rounded="rounded-lg"
          ></span>
        </button>
      </div>
    </div>
  );
}

export default DownloadPage