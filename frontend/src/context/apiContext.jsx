import { createContext, useContext, useState } from "react";

const ApiContext = createContext({});

export const useApi= () =>{
    return useContext(ApiContext);
}

export const ApiDataProvider= ({children})=>{
    const [ytLink, setYtLink] = useState("")
    const [qualityOptions, setQualityOptions] = useState([])
    const [thumbline, setThumbline] = useState("")
    const [title, setTitle] = useState("")
    const [duration, setDuration] = useState("")
    return (
      <ApiContext.Provider
        value={{
          ytLink, setYtLink,
          qualityOptions,
          setQualityOptions,
          thumbline,
          setThumbline,
          title,
          setTitle,
          duration,
          setDuration,
        }}
      >
        {children}
      </ApiContext.Provider>
    );
}