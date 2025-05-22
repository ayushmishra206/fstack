const API_URL = import.meta.env.API_URL;

if (!API_URL) {
  console.error('API_URL is not defined in environment variables');
}

export { API_URL };
