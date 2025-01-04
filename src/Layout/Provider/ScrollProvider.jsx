import React, { createContext, useContext, useRef, useState } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const galleryRef = useRef(null);
  const handleScrollToRef = () => {
    galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'});
    };
    const [needToScroll,setNeedToScroll]=useState();
    

  return (
    <ScrollContext.Provider value={{galleryRef,handleScrollToRef,needToScroll,setNeedToScroll}}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  return useContext(ScrollContext);
};