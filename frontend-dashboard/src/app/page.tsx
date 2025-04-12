"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Principal from "../principal/Principal";

const Page = () => {
  return (
    <div>
      <HomeWithLoading />
    </div>
  );
};

function HomeWithLoading() {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const duration = 3000;
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return !showComponent ? <LoadingScreen /> : <Principal />;
}

function LoadingScreen() {
  return (
    <Box className="loading">
      <div className="loading-text">
        {["B", "I", "E", "N", "V", "E", "N", "I", "D", "O", " ", "A", " ", "M", "I", "N", "E", "R", "A", " ", "S", "A", "N", " ", "C", "R", "I", "S", "T", "O", "B", "A", "L", " ", "S", ".", "A", "."].map((letter, index) => (
          <span key={index} className="loading-text-words">{letter}</span>
        ))}
      </div>
    </Box>
  );
}

export default Page;
