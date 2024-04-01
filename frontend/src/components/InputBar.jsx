import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosCloudDownload } from "react-icons/io";
import { SiYoutube } from "react-icons/si";
import axios from "axios";
import { Bounce, toast } from "react-toastify"; // Dont forget to import bounce
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../context/ApiContext";

const InputBar = () => {
  const [ytLink, setYtLink] = useState("");
  const navigate = useNavigate();
  const { videoInfo, setVideoInfo, qualityOptions, setQualityOptions } =
    useApi(); // context api calling
  // TODO: calling api handling all the logic after submission of link
  const ytLinkPattern = new RegExp(
    "^(?:https?:)?//?(?:www\\.)?((?:youtu(?:.be|be.com))/(?:watch\\?v=|embed/|v/)?|(?:youtube.com/.*?\\u0026)v=)([\\w-]+)(\\S+)?$"
  );
  const notifyError = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const notifySucess = (msg) =>{
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
  const handleSubmit = () => {
    if (ytLink.length === 0) {
      notifyError("Youtube link not provided!");
      return;
    } else if (!ytLink.match(ytLinkPattern)) {
      notifyError("Not A valid youtube link!");
      return;
    } else {
      // encoded yt-link
      const encodedYtLink= encodeURIComponent(ytLink)
      axios
        .get(
          `http://localhost:8000/video-info/${encodedYtLink}`
        )
        .then((res) => {
          setVideoInfo(res.data);
          const qualityArray = Object.keys(res.data.quality);
          setQualityOptions(qualityArray);
          console.log(qualityOptions);
          notifySucess("Sucessfully fetched data");
          navigate("/download");
        })
        .catch((err) => {
          notifyError("Error fetching data");
        });
    }
  };
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
          onChange={(e) => setYtLink(e.target.value)}
          className="p-4  lg:w-[30rem] rounded-md border-2 border-neutral-400/50 focus:outline-none text-xs lg:text-sm text-gray-500"
        />
        <button
          className="relative inline-block text-sm lg:text-lg group w-[8.5rem] lg:w-[10rem]"
          onClick={handleSubmit}
        >
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
};

export default InputBar;
