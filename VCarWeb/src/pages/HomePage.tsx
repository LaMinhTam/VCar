
import { useEffect } from "react";
import Banner from "../modules/home/Banner";
import CarSession from "../modules/home/CarSession";
import FilterCar from "../modules/home/FilterCar";
import { generateToken } from "../config/firebaseConfig";

const HomePage = () => {

  useEffect(() => {
    async function getToken() {
      await generateToken();
    }
    getToken();
  }, [])
  return (
    <div>
      <Banner></Banner>
      <FilterCar></FilterCar>
      <CarSession title="Popular" type="popular"></CarSession>
      <CarSession title="Recommendation" type="recommend"></CarSession>
      <CarSession title="Near you" type="near"></CarSession>
    </div>
  );
};

export default HomePage;