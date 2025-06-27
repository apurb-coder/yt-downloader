import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosCloudDownload } from "react-icons/io";
import { SiYoutube } from "react-icons/si";
import axios from "axios";
import { Bounce, toast } from "react-toastify"; // Dont forget to import bounce
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../context/ApiContext";

const InputBar = () => {
  const navigate = useNavigate();
  const {
    ytLink, setYtLink,
    qualityOptions,
    setQualityOptions,
    thumbline,
    setThumbline,
    title,
    setTitle,
    duration,
    setDuration,
  } = useApi(); // context api calling
  // TODO: calling api handling all the logic after submission of link
  const ytLinkPattern = new RegExp(
    "^(?:https?:)?//?(?:www\\.)?((?:youtu(?:.be|be.com))/(?:watch\\?v=|embed/|v/)?|(?:youtube.com/.*?\\u0026)v=)([\\w-]+)(\\S+)?$"
  );

  // Defining functions to show Toast 
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
  const notifySucess = (msg) => {
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
  };
  const notifyPromise = (requestPromise) => {
    toast.promise(
      requestPromise,
      {
        pending: "fetching data...",
        success: "Data SucessFully fetched",
        error: "Data fetching failed",
      },
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  };

  const handleSubmit = async () => {
    if (ytLink.length === 0) {
      notifyError("Youtube link not provided!");
      return;
    } else if (!ytLink.match(ytLinkPattern)) {
      notifyError("Not A valid youtube link!");
      return;
    } else {
      // encoded yt-link
      const encodedYtLink = encodeURIComponent(ytLink);
      try{
        const responsePromise =  () =>{
          const response = axios.get(
            `${import.meta.env.VITE_Backend_URL}/video-info/${encodedYtLink}`
          );
          notifyPromise(response);
          return response;
        }
        const response = await responsePromise();
        if(response !== undefined){
          const qualityArray = response.data.quality;
          setQualityOptions(qualityArray);
          const thumblineData = response.data.videoDetails.thumbnails;
          setThumbline(thumblineData);
          setTitle(response.data.videoDetails.title);
          setDuration(response.data.videoDetails.duration);
          // notifySucess("Sucessfully fetched data");
          navigate("/download");
        }
      }catch(err){
        console.log("Error fetching data");
      }
      
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[89vh] mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-800">Online Video Downloader</h1>
        <p className="text-gray-500 mt-4 text-lg">Paste a video link below to download</p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-2xl">
        <input
          type="text"
          name="ytlink"
          id="ytlink"
          placeholder="Paste your video link here"
          onChange={(e) => setYtLink(e.target.value)}
          className="p-4 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-red-500 transition-colors text-gray-600"
        />
        <button
          className="bg-red-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-red-700 transition-colors w-full md:w-auto mt-4 md:mt-0 md:ml-4 flex items-center justify-center"
          onClick={handleSubmit}
        >
          <IoIosCloudDownload className="mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default InputBar;
