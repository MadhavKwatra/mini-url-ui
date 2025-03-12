import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import UrlForm from "../components/url/UrlForm";
import UrlList from "../components/url/UrlList";
import { ShortUrl } from "../types/url.types";
import { CreateUrlFormData } from "../schemas/authSchema";
import urlService from "../services/urlService";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's URLs on component mount
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setIsLoading(true);
        const data = await urlService.getUserUrls();
        toast.success("URLs loaded successfully");
        setUrls(data);
        setError(null);
      } catch (err) {
        console.log(err, "Error loading URLs, Dashboard");
        const error = err as AxiosError;
        if (error.response?.status === 404) {
          setUrls([]);
          setError(null);
          toast.error("No URLs found");
        } else {
          setError("Failed to load your URLs. Please try again.");
        }

        console.error("Error fetching URLs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  // Handle creating a new short URL
  const handleCreateUrl = async (data: CreateUrlFormData) => {
    try {
      setIsCreating(true);
      setError(null);
      const response = await urlService.createShortUrl({
        originalUrl: data.originalUrl,
        customAlias: data.customAlias,
      });
      toast.success("URL created successfully");
      console.log(response, "NewURl returned from service");
      const newUrl = response.data;
      setUrls((prevUrls) => [newUrl, ...prevUrls]);
    } catch (err: any) {
      console.error("Error creating URL:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create short URL. Please try again."
      );
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  // TODO: Add delete functionality
  // Handle deleting a URL
  const handleDeleteUrl = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    try {
      await urlService.deleteUrl(id);
      setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
    } catch (err) {
      console.error("Error deleting URL:", err);
      setError("Failed to delete URL. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar - URL form */}
            <div className="md:col-span-1">
              <UrlForm
                onSubmit={handleCreateUrl}
                isLoading={isCreating}
                error={error}
              />
            </div>

            {/* Main content - URL list */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium mb-4">Your Short URLs</h2>
              <UrlList
                urls={urls}
                onDelete={handleDeleteUrl}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
