import { createContext, useContext, useState } from "react";

const apiContext = createContext({});

export const useApi= () =>{
    return useContext(apiContext);
}

export const apiDataProvider= ({children})=>{
    const [apiData, setApiData] = useState({});

    return (
        <apiContext.Provider value={{apiData,setApiData}}>
            {children}
        </apiContext.Provider>
    );
}