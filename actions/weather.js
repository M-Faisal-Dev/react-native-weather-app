import axios from "axios";

const API_KEY = "062b8fab08b649c2b32163433252606"; // Replace with your actual key

// Endpoint to get weather forecast
const forecastEndPoint = (location, days = 1) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`;

// Endpoint to search location
const locationEndPoint = (query) =>
  `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`;

// Function to fetch weather forecast
export const fetchForecast = async (location, days = 1) => {
  try {
    const response = await axios.get(forecastEndPoint(location, days));
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

// Function to search locations
export const searchLocation = async (query) => {
  try {
    const response = await axios.get(locationEndPoint(query));
    return response.data;
  } catch (error) {
    console.error("Error searching location:", error);
    throw error;
  }
};
