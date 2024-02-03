import HomePageComponent from "./components/HomePageComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";

const getBestsellers = async () => {
  const { data } = await axios.get("/api/products/bestsellers");
  return data;
};

const HomePage = () => {
  const { categories } = useSelector((state) => state.getCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categories.length > 0) {
      setLoading(false);
    }
  }, [categories]);

  return (
    <>
      {loading ? (
        <h1>Loading categories....</h1>
      ) : (
        <HomePageComponent
          categories={categories}
          getBestsellers={getBestsellers}
        />
      )}
    </>
  );
};

export default HomePage;
