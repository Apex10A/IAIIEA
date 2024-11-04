"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "@/assets/landingpage/images/Frame 1321316359.png";
import image2 from "@/assets/landingpage/images/Frame 1321316359.png";
import image3 from "@/assets/landingpage/images/Frame 1321316359.png";

const images = [image1, image2, image3];

const FramerCarousel = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    const newIndex = (current + newDirection + images.length) % images.length;
    setCurrent([newIndex, newDirection]);
  };

  return (
    <div className="carousel" style={{ position: "relative", overflow: "hidden", width: "600px", height: "400px" }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={current}
          src={images[current]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AnimatePresence>
      <div className="controls" style={{ position: "absolute", bottom: "20px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        <button onClick={() => paginate(-1)} style={buttonStyle}>{"<"}</button>
        <button onClick={() => paginate(1)} style={buttonStyle}>{">"}</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: "rgba(0,0,0,0.5)",
  border: "none",
  color: "#fff",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "24px",
  borderRadius: "5px",
};

export default FramerCarousel;
