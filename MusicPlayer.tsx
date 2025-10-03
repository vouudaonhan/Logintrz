import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 🔑 Lấy signed URL từ backend
  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch("/api/video");
        const data = await res.json();
        setVideoUrl(data.url);
      } catch (err) {
        console.error("Lỗi lấy video:", err);
      }
    }
    fetchVideo();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden w-64">
        <div className="relative bg-black">
          {videoUrl ? (
            <video ref={videoRef} className="w-full h-36 object-cover" loop muted={isMuted}>
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="h-36 flex items-center justify-center text-gray-400">
              Loading...
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
        </div>

        <div className="p-3 flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause size={18} className="text-white" />
            ) : (
              <Play size={18} className="text-white ml-0.5" />
            )}
          </button>

          {/* Info */}
          <div className="flex-1 text-white">
            <div className="text-sm font-medium truncate">Đang phát nhạc</div>
            <div className="text-xs text-gray-400 truncate">Music Player</div>
          </div>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX size={18} className="text-white" />
            ) : (
              <Volume2 size={18} className="text-white" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={() => setIsVisible(false)}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
