import axios from "axios";

const API = axios.create({
  baseURL: "https://six93health-system.onrender.com/api"
});

export default API;