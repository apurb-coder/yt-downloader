import { createContext, useContext, useState } from "react";

const ApiContext = createContext({});

export const useApi= () =>{
    return useContext(ApiContext);
}

export const ApiDataProvider= ({children})=>{
    const [apiData, setApiData] = useState({});

    return (
        <ApiContext.Provider value={{apiData,setApiData}}>
            {children}
        </ApiContext.Provider>
    );
}