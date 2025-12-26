import axios from "axios";
const apiClient = axios.create({
  baseURL: "https://api.lyrics.ovh/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { apiClient };