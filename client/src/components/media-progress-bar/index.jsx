import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressbar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => setShowProgress(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div className="w-full mt-5 mb-6">
      {/* Label */}
      <div className="flex justify-between mb-2 text-sm text-gray-600 font-medium">
        <span>Uploading...</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* Progress bar container */}
      <div className="relative w-full h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Animated progress */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(147,51,234,0.6)]"
          initial={{ width: 0 }}
          animate={{
            width: `${animatedProgress}%`,
            transition: { duration: 0.4, ease: "easeInOut" },
          }}
        />

        {/* Shimmer effect while uploading */}
        {isMediaUploading && progress < 100 && (
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 bg-white opacity-20 blur-md"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Success pulse when complete */}
      {progress >= 100 && (
        <motion.div
          className="text-xs text-green-600 font-semibold mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✅ Upload Complete!
        </motion.div>
      )}
    </div>
  );
}

export default MediaProgressbar;
