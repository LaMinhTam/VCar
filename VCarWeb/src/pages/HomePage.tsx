import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchCarsRequest } from "../store/carSlice";
import FilterSidebar from "../components/FilterSidebar";
import CarCard from "../components/CarCard";
import Header from "../components/Header"; // Import Header

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, loading, error } = useSelector((state: RootState) => state.car);
  const [filters, setFilters] = useState<any>({
    transmission: [],
    seats: [],
    minConsumption: 0,
    maxConsumption: 20,
    maxRate: 1000000,
  });

  useEffect(() => {
    dispatch(fetchCarsRequest(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col bg-[#f8f4fc] min-h-screen">
      <Header />
      <div className="flex mt-16">
        {" "}
        <FilterSidebar onFilterChange={handleFilterChange} />
        <div className="flex-1 ml-64 p-4">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {!loading && !error && (
            <>
              {cars.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div>No cars available</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
