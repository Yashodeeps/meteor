import React, { useState, useEffect } from "react";

// Comprehensive type definitions
interface SiteData {
  url: string;
  title: string;
  visitCount?: number;
  favicon: string;
  hostname: string;
}

// Mock data for fallback
const DEFAULT_SITES: SiteData[] = [
  {
    url: "https://www.youtube.com",
    title: "YouTube",
    visitCount: 100,
    favicon: "https://www.youtube.com/favicon.ico",
    hostname: "www.youtube.com",
  },
];

const ChromeShortcuts: React.FC<{
  maxSites?: number;
  useMockData?: boolean;
}> = ({ maxSites = 5, useMockData = false }) => {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = () => {
      // Check if in Chrome extension context and not forcing mock data
      if (!useMockData && typeof chrome !== "undefined" && chrome.history) {
        chrome.history.search(
          {
            text: "",
            maxResults: maxSites * 2,
            startTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
          (historyItems) => {
            try {
              const processedSites: SiteData[] = historyItems
                .filter(
                  (item) => item.url !== undefined && (item.visitCount || 0) > 2
                )
                .sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
                .slice(0, maxSites)
                .map((item) => {
                  const url = new URL(item.url!);
                  return {
                    url: item.url!,
                    title: item.title || url.hostname,
                    visitCount: item.visitCount || 0,
                    favicon: `chrome://favicon/size/64@1x/${item.url}`,
                    hostname: url.hostname,
                  };
                });

              setSites(processedSites);
              setLoading(false);
            } catch (err) {
              setError("Error processing history items");
              setLoading(false);
            }
          }
        );
      } else {
        // Fallback to mock data or localStorage
        try {
          const localStorageSites = JSON.parse(
            localStorage.getItem("siteVisits") || "[]"
          );

          const sitesToUse =
            localStorageSites.length > 0 ? localStorageSites : DEFAULT_SITES;

          const processedSites = sitesToUse
            .slice(0, maxSites)
            .map((site: SiteData) => ({
              ...site,
              favicon: `https://www.google.com/s2/favicons?domain=${site.hostname}`,
            }));

          setSites(processedSites);
          setLoading(false);
        } catch (err) {
          setSites(DEFAULT_SITES.slice(0, maxSites));
          setLoading(false);
        }
      }
    };

    fetchSites();
  }, [maxSites, useMockData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-600 p-4 rounded">{error}</div>;
  }

  return (
    <div className=" p-3">
      <div className="grid grid-cols-5 gap-4">
        {sites.map((site) => (
          <a
            key={site.url}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <img
              src={site.favicon}
              alt={`${site.title} favicon`}
              className="w-6 h-6 mb-2 rounded-md group-hover:scale-110 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://www.google.com/s2/favicons?domain=${site.hostname}`;
              }}
            />
            <p className="text-sm font-medium text-center truncate max-w-full text-black">
              {site.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChromeShortcuts;
