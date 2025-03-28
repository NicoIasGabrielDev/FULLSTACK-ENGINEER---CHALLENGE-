import axios from "axios";

const API_BASE_URL = "http://localhost:3000/upload";

export const uploadSpreadsheet = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/spreadsheet`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};
