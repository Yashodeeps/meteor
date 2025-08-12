import { Settings, Timer, Upload, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolTipButton from "./ToolTipButton";

interface BackgroundImage {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
}

const Toolbar = () => {
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>(
    []
  );
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  // Load saved background images and current selection on component mount
  useEffect(() => {
    chrome?.storage?.local.get(
      ["backgroundImages", "selectedBackground"],
      (result) => {
        if (result.backgroundImages) {
          setBackgroundImages(result.backgroundImages);
        }
        if (result.selectedBackground) {
          setSelectedBackground(result.selectedBackground);
        }
      }
    );
  }, []);

  // Function to generate a safe position within screen bounds
  const getSafePosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const timerWidth = 300;
    const timerHeight = 150;

    const maxX = Math.max(0, screenWidth - timerWidth);
    const maxY = Math.max(0, screenHeight - timerHeight);

    const margin = 50;
    const safeX = Math.random() * Math.max(0, maxX - margin * 2) + margin;
    const safeY = Math.random() * Math.max(0, maxY - margin * 2) + margin;

    return {
      x: Math.floor(safeX),
      y: Math.floor(safeY),
    };
  };

  const addTimer = () => {
    console.log("Adding new timer");
    chrome?.storage?.local.get("timers", (result) => {
      const timers = result.timers ?? [];

      const existingPositions = timers.map(
        (timer: any) => timer.timerPosition || { x: 0, y: 0 }
      );

      let newPosition = getSafePosition();
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const hasOverlap = existingPositions.some((pos: any) => {
          const distance = Math.sqrt(
            Math.pow(newPosition.x - pos.x, 2) +
              Math.pow(newPosition.y - pos.y, 2)
          );
          return distance < 200;
        });

        if (!hasOverlap) break;
        newPosition = getSafePosition();
        attempts++;
      }

      const newTimer = {
        id: nanoid(),
        mission: "Enter your mission",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isRunning: false,
        remainingTime: "0",
        timerPosition: newPosition,
      };

      const updatedTimers = [...timers, newTimer];
      chrome?.storage?.local.set({ timers: updatedTimers }, () => {
        console.log("Timer added:", newTimer);
      });
    });
  };

  const handleFileUpload = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newBackgroundImages: BackgroundImage[] = [];

    for (const file of imageFiles) {
      // Convert file to data URL for storage
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const backgroundImage: BackgroundImage = {
        id: nanoid(),
        name: file.name,
        dataUrl,
        size: file.size,
      };

      newBackgroundImages.push(backgroundImage);
    }

    const updatedImages = [...backgroundImages, ...newBackgroundImages];
    setBackgroundImages(updatedImages);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files);
    }
  };

  const removeBackgroundImage = (imageId: string) => {
    const updatedImages = backgroundImages.filter((img) => img.id !== imageId);
    setBackgroundImages(updatedImages);
    chrome?.storage?.local.set({ backgroundImages: updatedImages });

    // If the removed image was selected, clear selection
    if (selectedBackground === imageId) {
      setSelectedBackground("");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const saveSettings = () => {
    // Save all background images and selected background to Chrome storage
    chrome?.storage?.local.set(
      {
        backgroundImages,
        selectedBackground,
      },
      () => {
        console.log("Settings saved successfully");

        // Apply the background immediately if one is selected
        if (selectedBackground) {
          const selectedImage = backgroundImages.find(
            (img) => img.id === selectedBackground
          );
          if (selectedImage) {
            // Set the background image on the body or a specific container
            document.body.style.backgroundImage = `url(${selectedImage.dataUrl})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
          }
        } else {
          // Clear background if no image is selected
          document.body.style.backgroundImage = "";
        }
      }
    );
  };

  return (
    <div
      className="fixed top-1/2 left-4 -translate-y-1/2 flex flex-col gap-3 p-1 rounded-lg shadow-xl backdrop-blur-md bg-white/20 border border-white/30"
      style={{
        zIndex: 1000,
        alignItems: "center",
      }}
    >
      <ToolTipButton tooltipContent="Add mission timers" side="right">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-sky-900"
          onClick={addTimer}
        >
          <Timer />
        </Button>
      </ToolTipButton>

      <Dialog>
        <DialogTrigger>
          <ToolTipButton tooltipContent="Settings" side="right">
            <Button size="icon" variant="ghost" className="hover:bg-sky-900">
              <Settings />
            </Button>
          </ToolTipButton>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] w-[95vw] max-w-[95vw] h-[85vh] max-h-[85vh] bg-white/10 backdrop-blur-md flex flex-col p-0 gap-0">
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-white/20">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-xl font-semibold">
                Meteor Settings
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm">
                Customize your meteor experience with personalized backgrounds
                and preferences
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="background" className="h-full flex flex-col">
              {/* Fixed Tabs List */}
              <div className="flex-shrink-0 px-6 pt-4">
                <TabsList className="grid w-full grid-cols-1 bg-white/10 h-10">
                  <TabsTrigger
                    value="background"
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium"
                  >
                    Background Images
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable Tab Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <TabsContent
                  value="background"
                  className="mt-4 space-y-6 h-full"
                >
                  <Card className="bg-white/5 border-white/20 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-lg font-medium">
                        Upload & Manage Backgrounds
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* File Upload Area */}
                      <div className="space-y-3">
                        <Label className="text-white/90 text-sm font-medium">
                          Add New Images
                        </Label>

                        <input
                          id="background-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleInputChange}
                        />

                        <label
                          htmlFor="background-upload"
                          className={`flex cursor-pointer select-none items-center justify-center rounded-xl border-2 border-dashed p-8 text-sm transition-all duration-200 ${
                            dragActive
                              ? "border-sky-400 bg-sky-500/15 ring-2 ring-sky-400/50 scale-[1.02]"
                              : "border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/40"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <div className="text-center">
                            <Upload className="mx-auto h-10 w-10 text-white/60 mb-3" />
                            <p className="font-medium text-white/90 mb-1">
                              Drag and drop images here
                            </p>
                            <p className="text-xs text-white/60">
                              or click to browse • PNG, JPG, JPEG supported
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Background Selection */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white/90 text-sm font-medium">
                            Select Active Background
                          </Label>
                          {backgroundImages.length > 0 && (
                            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                              {backgroundImages.length} image
                              {backgroundImages.length !== 1 ? "s" : ""}{" "}
                              uploaded
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                          {/* Default/No background option */}
                          <div
                            className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              selectedBackground === ""
                                ? "border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/25"
                                : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:shadow-lg"
                            }`}
                            onClick={() => setSelectedBackground("")}
                          >
                            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-3 shadow-inner">
                              <span className="text-sm text-white/70 font-medium">
                                Default
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-white/90 font-medium truncate">
                                No Background
                              </p>
                              <p className="text-xs text-white/60">
                                System default
                              </p>
                            </div>
                            {selectedBackground === "" && (
                              <div className="absolute top-2 right-2 bg-sky-500 text-white rounded-full p-1 shadow-lg">
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                              </div>
                            )}
                          </div>

                          {backgroundImages.map((image) => (
                            <div
                              key={image.id}
                              className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedBackground === image.id
                                  ? "border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/25"
                                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:shadow-lg"
                              }`}
                              onClick={() => setSelectedBackground(image.id)}
                            >
                              <div className="aspect-video rounded-lg overflow-hidden mb-3 shadow-md">
                                <img
                                  src={image.dataUrl}
                                  alt={image.name}
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-white/90 font-medium truncate">
                                  {image.name}
                                </p>
                                <p className="text-xs text-white/60">
                                  {formatFileSize(image.size)}
                                </p>
                              </div>

                              {/* Selection indicator */}
                              {selectedBackground === image.id && (
                                <div className="absolute top-2 right-2 bg-sky-500 text-white rounded-full p-1 shadow-lg">
                                  <div className="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                              )}

                              {/* Remove button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeBackgroundImage(image.id);
                                }}
                                className="absolute top-2 left-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {backgroundImages.length === 0 && (
                          <div className="text-center py-8 text-white/60">
                            <p className="text-sm">
                              No background images uploaded yet
                            </p>
                            <p className="text-xs mt-1">
                              Upload some images to get started
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-white/20 bg-white/5">
            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 font-medium"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={saveSettings}
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-lg"
              >
                Save Settings
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Toolbar;
