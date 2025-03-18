"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";
import { ToastContainer } from "react-toastify";



const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProgressBar height="4px" color="#eab308" shallowRouting />
      <ToastContainer />
      {children}
    </>
  );
};

export default MainProvider;
