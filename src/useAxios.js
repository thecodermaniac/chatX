import axios from "axios";

const useAxios = axios.create({
  baseURL: import.meta.env.VITE_HTTP_ENDPOINT,
});

export default useAxios;
