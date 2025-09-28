import React, { useEffect } from "react";
import "./home.css";
import Hero from '../../components/Hero/Hero';
import Interactive from '../../components/Interactive/Interactive';
import Services from '../../components/Services/Services';
import RecommendedServices from '../../components/RecommendedServices/RecommendedServices';
import VR from '../../components/VR/VR';

const Home = () => {
 
  return (
    <>
      <Hero/>
      <Interactive/>
      <Services/>
      <RecommendedServices/>
      <VR/>
    </>
  );
};

export default Home;
