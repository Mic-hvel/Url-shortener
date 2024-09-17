import { useState } from "react";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleLongUrl = async (e) => {
    e.preventDefault();

    let headers = {};
    const token = sessionStorage.getItem("token");
    if (token) {
      headers = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      };
    }

    if (longUrl === "") {
      alert("Please enter a URL");
      return;
    }

    console.log(longUrl);

    try {
      const response = await fetch("http://localhost:5500/urls/shorten", {
        method: "POST",
        headers,
        body: JSON.stringify({ long_url: longUrl }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      let shortUrl = data.short_url_id;
      setShortUrl(shortUrl);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleChange = (e) => {
    setLongUrl(e.target.value);
  };

  return (
    <div className="App">
      <form onSubmit={handleLongUrl}>
        <fieldset>
          <legend>URL Shortener</legend>
          <label htmlFor="url_input">URL:</label>
          <input
            className="url-input"
            id="url_input"
            type="text"
            name="url"
            placeholder="Insert a URL"
            onChange={handleChange}
            value={longUrl}
          />
          <button className="submit-btn" type="submit">
            POST URL
          </button>

          <div className="view">
            <div className="longUrl">LongURL: {longUrl} </div>
            <div className="shortUrl">
              shortURL: {shortUrl}{" "}
              {shortUrl && (
                <a href={longUrl} target="_blank" rel="noreferrer">
                  <button>Redirect</button>
                </a>
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default App;
