import { createContext, useContext, useState } from "react";

const ApiContext = createContext({});

export const useApi= () =>{
    return useContext(ApiContext);
}

export const ApiDataProvider= ({children})=>{
    const [videoInfo, setVideoInfo] = useState({})
    const [qualityOptions, setQualityOptions] = useState([])
    const [thumbline, setThumbline] = useState("")
    return (
      <ApiContext.Provider
        value={{
          videoInfo,
          setVideoInfo,
          qualityOptions,
          setQualityOptions,
          thumbline,
          setThumbline,
        }}
      >
        {children}
      </ApiContext.Provider>
    );
}