import { createContext, useContext, useState } from "react";

const ApiContext = createContext({});

export const useApi= () =>{
    return useContext(ApiContext);
}

export const ApiDataProvider= ({children})=>{
    const [videoInfo, setVideoInfo] = useState([])

    return (
        <ApiContext.Provider value={{videoInfo,setVideoInfo}}>
            {children}
        </ApiContext.Provider>
    );
}