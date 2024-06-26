import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosCloudDownload } from "react-icons/io";
import axios from "axios";
import { Bounce, toast } from "react-toastify"; // Dont forget to import bounce
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useApi } from "../context/ApiContext";

const DownloadPage = () => {
  const { title, duration, thumbline, qualityOptions, ytLink } = useApi();
  const [optionsQualityObject, setOptionsQualityObject] = useState({});
  const [downloadOptionSelected, setDownloadOptionSelected] = useState("");
  const navigate=  useNavigate();
  useEffect(()=>{
    if(thumbline.length===0 && title.length===0 && ytLink.length===0){
      navigate("/")
    }
  },[])
  useEffect(() => {
    const newOptionsQualityObject = qualityOptions.map((quality) => ({
      value: quality,
      label: quality,
    }));
    setOptionsQualityObject(newOptionsQualityObject);
    console.log(thumbline);
  }, [qualityOptions]);
  const customStyles = {
    option: (provided, state) => ({
      // styles for option element itself
      ...provided,
      borderRadius: "0.5rem",
      width: "100%",
      borderColor: "rgba(107, 114, 128, 0.5)",
      outline: "none",
    }),
    control: (provided) => ({
      // styles for control element itself
      ...provided,
      borderRadius: "0.5rem", // equivalent to rounded-lg
      borderWidth: "2px", // equivalent to border-2
      borderColor: "rgba(107, 114, 128, 0.5)", // equivalent to border-gray-700/50
      outline: "none", // equivalent to outline-none
      boxShadow: "none", // to remove the default react-select's box-shadow on focus
    }),
  };
  const notifyPromise = (requestPromise, pendingMsg, sucessMsg, errorMsg) => {
    toast.promise(
      requestPromise,
      {
        pending: pendingMsg,
        success: sucessMsg,
        error: errorMsg,
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
  // function to start downloading file
  
  const startDownload =  (url) => {
    window.location.href = url;
  };
  // TODO: handle download function
  const handleDownload = async () => {
    console.log(downloadOptionSelected);
    if (downloadOptionSelected.length === 0) {
      notifyError("Quality of video not selected");
    } else {
      // encoded yt-link
      const encodedYtLink = encodeURIComponent(ytLink);
      try {
        const responsePromise = () => {
          const response = axios.post(
            `${import.meta.env.VITE_Backend_URL}/video-download/${encodedYtLink}`,
            {  "quality" : downloadOptionSelected }
          );
          notifyPromise(
            response,
            "Preparing your file...",
            "Download will start shortly",
            "Download failed"
          );
          
          return response;
        };
        const response = await responsePromise();
        const newFilePath = response.data?.filePath;
        if (response !== undefined) {
          startDownload(
            `${import.meta.env.VITE_Backend_URL}/${newFilePath}`
          ); // starting download
        }
      } catch (err) {
        console.log("Error fetching data");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] lg:h-[89vh] mx-auto">
      <div className="flex flex-col justify-center items-center border-2 border-gray-700/50 rounded-md px-5 py-10 w-[80%] lg:w-[50%]">
        <div className="flex justify-between lg:justify-around items-center w-full flex-col lg:flex-row">
          <img
            src={thumbline[thumbline.length - 1]?.url}
            alt="thumbline"
            className="w-[20rem] h-[11.25rem] rounded-lg"
          />
          <Select
            styles={customStyles}
            defaultValue={optionsQualityObject[0]}
            options={optionsQualityObject}
            className="mt-7"
            onChange={(option) => setDownloadOptionSelected(option.value)}
          />
        </div>
        <div className="text-gray-700/90 text-center mt-7">
          <h3>{title && title}</h3>
          <h3 className="mt-5">Duration: {duration && duration}</h3>
        </div>
        <div className="z-0">
          <button
            className="relative inline-block text-sm lg:text-lg group w-[8.5rem] lg:w-[10rem] mt-7 lg:mt-16"
            onClick={handleDownload}
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
    </div>
  );
};

export default DownloadPage;
