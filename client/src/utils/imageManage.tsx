const uploadImage = async (file: string | Blob, url: RequestInfo | URL) => {
  const token = localStorage.getItem("token");
  if (token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const formData = new FormData();
    formData.append("image", file);
    const reqOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
    };
    try {
      const response = await fetch(url, reqOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      alert("image upload error: ");
    }
  }
};
export default uploadImage;
