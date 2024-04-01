import React from 'react'
import sampleThumbline from "../assets/sampleThumbline.jpg"

const DownloadPage = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] lg:h-[89vh] mx-auto">
      <div className="flex justify-center items-center space-x-10">
        <img src={sampleThumbline} alt="thumbline" className="w-[20rem] h-[11.25rem] rounded-lg" />
        <select name="videoQuality" id="videoQuality" className="w-[10rem] h-[4rem] rounded-lg border-2 border-gray-700/50 outline-none">
          <option value="1080p">1080p</option>
          <option value="1080p">1080p</option>
          <option value="1080p">1080p</option>
        </select>
      </div>
    </div>
  );
}

export default DownloadPage