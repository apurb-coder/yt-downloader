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
    const newOptionsQualityObject = Object.keys(qualityOptions).map((quality) => ({
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
    <div className="flex justify-center items-center h-[89vh] mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row items-center">
          <img
            src={thumbline[thumbline.length - 1]?.url}
            alt="thumbnail"
            className="w-full lg:w-1/2 rounded-lg shadow-md"
          />
          <div className="w-full lg:w-1/2 lg:pl-8 mt-6 lg:mt-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">Duration: {duration}</p>
            <Select
              styles={customStyles}
              options={optionsQualityObject}
              placeholder="Select Quality"
              className="mb-6"
              onChange={(option) => setDownloadOptionSelected(option.value)}
            />
            <button
              className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors w-full flex items-center justify-center"
              onClick={handleDownload}
            >
              <IoIosCloudDownload className="mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
