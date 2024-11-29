import React, { useState } from "react";
import axios from "axios";

// Define the types for the response data
interface ApiResponse {
  image_base64: string;
  prompt: string;
}

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImageBase64("");

    try {
      // Make API request to your cloud function endpoint
      const response = await axios.post<ApiResponse>(
        "https://us-central1-assignment02-generative-ai.cloudfunctions.net/stable-diffusion-rest-api",
        {
          instances: [
            {
              prompt: prompt,
              num_inference_steps: 50,
              size: "1024x1024",
            },
          ],
          parameters: {
            temperature: 1.0,
            top_p: 0.9,
          },
        }
      );

      // Check if the response contains the image base64 data
      if (response.data && response.data.image_base64) {
        setImageBase64(response.data.image_base64);
      } else {
        setError("No image was returned from the backend");
      }
    } catch (err) {
      setError(
        "Error generating image: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", width: "100vw" }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>
        Stable Diffusion Image Generator
      </h1>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Enter your prompt here"
        rows={4}
        cols={50}
        style={{ marginBottom: "10px", maxWidth: "600px", height: "50px" }}
      />
      <br />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {imageBase64 && (
        <div>
          <h2>Generated Image</h2>
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt="Generated"
            style={{ maxWidth: "600px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
