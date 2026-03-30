<<<<<<< HEAD


// pages/Home.jsx
import React from "react";
import ActionCards from "./ActionCards";
const Home = () => {
  return (
    <div className="container px-4  mx-auto min-h-screen flex items-center justify-center">
      <ActionCards />
=======
import Contact from "./Contact";
import Features from "./Features";
import Header from "./Header"

// pages/Home.jsx
const Home = () => {
  return (
    <div className="container px-4  mx-auto">
      <Header />
      <Features />
      <Contact />
>>>>>>> develop
    </div>
  );
};

export default Home;