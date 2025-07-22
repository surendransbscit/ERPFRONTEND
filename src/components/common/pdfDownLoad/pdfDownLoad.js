import axios from "axios";
import secureLocalStorage from "react-secure-storage";

export const downloadPDF = async (printPageURL,id) => {
    const data = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/${printPageURL}/${id}/`, {
      headers: {
        Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
      },
    });
  
    try {
      const response = await axios.get(data?.data?.pdf_url, {
        responseType: "blob",
      });
  
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  
      const url = window.URL.createObjectURL(pdfBlob);
  
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.target = "_blank";
      tempLink.setAttribute("print", `invoice.pdf`);
  
      document.body.appendChild(tempLink);
      tempLink.click();
  
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };