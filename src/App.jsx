import { useEffect, useState } from "react";
import "./App.css";
import { API_BASE_URL } from "./constants";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import CopyToClipboardComponent from "./components/CopyToClipboardComponent";
function App() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [previousUrls, setPreviousUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousUrls = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/urls`);
        console.log("RESPONES", response);
        if (response.status == 200) {
          setPreviousUrls(response.data.data);
          toast.success(response?.data?.message || "URL Fetched Successfully");
        } else {
          toast.error(
            response?.data?.message || "Failed to load previous URLs"
          );
        }
      } catch (error) {
        toast.error("Failed to load previous URLs");
        console.error("Error fetching previous URLs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousUrls();
  }, []);

  console.log("shortend", shortenedUrl);
  console.log("previous", previousUrls);

  const shortenUrl = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, {
        originalUrl: url,
      });
      console.log("Response of API", response);
      // setShortUrl(response.data.shortened_url)
      if (response.status == 201 || response.status == 200) {
        setShortenedUrl(response.data.data.shortUrl);
        toast.success(response?.data?.message || "URL Shortened Successfully");

        if (response.status == 201) {
          setPreviousUrls((prevState) => [response.data.data, ...prevState]);
        }
      } else {
        const errorMessage =
          response?.data?.message ||
          "An error occurred while shortening the URL";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while shortening the URL";
      toast.error(errorMessage);
      console.error("Error shortening URL:", error);
    }
  };

  const handleCopy = () => {
    toast.info("URL copied to clipboard!", { autoClose: 2000 });
  };

  return (
    <>
      <div className="app">
        <div className="shortener card">
          <h1>Link Shortener</h1>
          <p className="description">Shorten your long URLs with ease.</p>
          {/* form to enter URL to be shortened */}
          <form onSubmit={shortenUrl} className="input-section">
            <input
              type="url"
              placeholder="Enter URL to shorten"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit">Shorten</button>
          </form>
          {/* Section to view shortened URLS */}
          {shortenedUrl && (
            <div className="result">
              <h2>Shortened URL</h2>
              <div className="copyable-url">
                <input type="text" value={shortenedUrl} readOnly />
                <CopyToClipboardComponent text={shortenedUrl} onCopy={handleCopy}/>
              </div>
            </div>
          )}
        </div>
        {loading && <div className="loading">Loading previous URLs...</div>}
        {previousUrls.length > 0 && (
          <div className="previous-urls">
            <h2>Recent Links</h2>
            <div className="links-info">
              <span>Link</span>
              <span>Clicks</span>
            </div>
            <ul>
              {previousUrls.map((previousUrl, index) => (
                <li key={index}>
                  <div>
                    <span className="short-url">{previousUrl.shortUrl}</span>
                    <span className="original-url">
                      Original - {previousUrl.originalUrl}
                    </span>
                  </div>

                  <span className="clicks">{previousUrl.clicks}
                    <CopyToClipboardComponent text={previousUrl.shortUrl} onCopy={handleCopy}/>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
