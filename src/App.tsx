import { useEffect, useState } from "react";
import TimerManager from "./components/TimerManager";
import Toolbar from "./components/Toolbar";

interface BackgroundImage {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
}

// Background hook for the app
const useAppBackground = () => {
  const [currentBackground, setCurrentBackground] =
    useState<BackgroundImage | null>({
      id: "default",
      name: "Default Background",
      dataUrl: "/default.jpg",
      size: 0,
    });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load background from Chrome storage
    const loadBackground = () => {
      chrome?.storage?.local.get(
        ["backgroundImages", "selectedBackground"],
        (result) => {
          const images = result.backgroundImages || [];
          const selectedId = result.selectedBackground;

          if (selectedId) {
            const selectedImage = images.find(
              (img: BackgroundImage) => img.id === selectedId
            );
            setCurrentBackground(selectedImage || null);
          } else {
            setCurrentBackground(null);
          }
          setIsLoading(false);
        }
      );
    };

    // Listen for storage changes
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.selectedBackground || changes.backgroundImages) {
        loadBackground();
      }
    };

    loadBackground();
    chrome?.storage?.onChanged.addListener(handleStorageChange);

    return () => {
      chrome?.storage?.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return { currentBackground, isLoading };
};

const BackgroundMedia = () => {
  const { currentBackground, isLoading } = useAppBackground();

  // Show loading state briefly to avoid flash
  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 w-full min-h-screen overflow-hidden z-0 bg-black" />
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen overflow-hidden z-0">
      {currentBackground ? (
        // User uploaded background
        <img
          className="min-w-full min-h-screen absolute object-cover transition-opacity duration-500"
          src={currentBackground.dataUrl}
          alt={`Background: ${currentBackground.name}`}
        />
      ) : (
        // Default background
        <>
          {/* Uncomment this if you want video as default */}
          {/* <video
            className="min-w-full min-h-screen absolute object-cover"
            src="../space.mp4"
            autoPlay
            loop
            muted
          /> */}
          <img
            className="min-w-full min-h-screen absolute object-cover"
            src="/default.jpg"
            alt="space"
          />
        </>
      )}

      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

const App = () => {
  return (
    <div className="relative flex flex-col h-full font-retro">
      <BackgroundMedia />
      <div className="relative z-10 h-full bg-transparent">
        <div>
          <img
            className="absolute top-3 left-3 w-32"
            src="/meteor.png"
            alt="logo"
          />
        </div>
        <div className="dark:text-white text-xl h-full flex items-center justify-center">
          <TimerManager />
          <div className="absolute top-20 left-8 flex flex-col gap-5">
            <Toolbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
