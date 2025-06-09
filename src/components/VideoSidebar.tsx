import React from 'react';
import { Youtube } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  channel: string;
}

interface VideoSidebarProps {
  videos: Video[];
}

const VideoSidebar: React.FC<VideoSidebarProps> = ({ videos }) => {
  if (videos.length === 0) return null;

  return (
    <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/20 p-4 overflow-y-auto chat-scrollbar">
      <div className="flex items-center space-x-2 mb-4">
        <Youtube className="w-5 h-5 text-red-400" />
        <h2 className="text-white font-semibold">Helpful Videos</h2>
      </div>
      <div className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:bg-white/15 transition-colors duration-200 card-hover"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-blue-200 text-xs mb-2 line-clamp-2">
                {video.description}
              </p>
              <p className="text-blue-300 text-xs mb-2">{video.channel}</p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs transition-colors duration-200"
              >
                <Youtube className="w-3 h-3" />
                <span>Watch Video</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSidebar;
