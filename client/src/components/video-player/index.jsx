import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0); // fraction 0..1
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  function handlePlayAndPause() {
    setPlaying((p) => !p);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  // --- Helpers: safe wrappers for various player shapes ---
  const safeGetDuration = useCallback(() => {
    const player = playerRef.current;
    if (!player) return 0;

    // prefer wrapper's getDuration()
    if (typeof player.getDuration === "function") {
      try {
        const maybe = player.getDuration();
        return typeof maybe === "number" && !isNaN(maybe) ? maybe : 0;
      } catch {
        // ignore
      }
    }

    // fallback to internal player's duration property
    const internal = typeof player.getInternalPlayer === "function" ? player.getInternalPlayer() : null;
    if (internal && typeof internal.duration === "number") {
      return internal.duration;
    }

    return 0;
  }, []);

  // `amount` is either seconds (number) or fraction (0..1) depending on `type`
  const safeSeekTo = useCallback((amount, type = "seconds") => {
    const player = playerRef.current;
    if (!player) return;

    // 1) Prefer wrapper's seekTo (react-player exposes this)
    if (typeof player.seekTo === "function") {
      try {
        player.seekTo(amount, type);
        return;
      } catch (err) {
        // continue to fallback
      }
    }

    // 2) Fallback to internal player
    const internal = typeof player.getInternalPlayer === "function" ? player.getInternalPlayer() : player;

    if (!internal) return;

    const duration = safeGetDuration() || internal.duration || 0;

    // If type is fraction convert to seconds for HTMLMediaElement
    if (type === "fraction") {
      const seconds = duration * (Number(amount) || 0);
      if (typeof internal.currentTime === "number") {
        internal.currentTime = seconds;
        return;
      }
      if (typeof internal.seekTo === "function") {
        internal.seekTo(seconds);
        return;
      }
    } else {
      // type === "seconds"
      if (typeof internal.currentTime === "number") {
        internal.currentTime = Number(amount) || 0;
        return;
      }
      if (typeof internal.seekTo === "function") {
        internal.seekTo(amount);
        return;
      }
    }

    // nothing worked — optionally log for debugging
    // console.warn("safeSeekTo: could not seek, player shape unknown", internal);
  }, [safeGetDuration]);

  const safeGetCurrentTime = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return null;

    // prefer wrapper's getCurrentTime()
    if (typeof player.getCurrentTime === "function") {
      try {
        const maybe = player.getCurrentTime();
        // handle promise or direct number
        if (maybe && typeof maybe.then === "function") {
          return await maybe;
        }
        return maybe;
      } catch {
        // fallback
      }
    }

    // fallback to internal player's currentTime
    const internal = typeof player.getInternalPlayer === "function" ? player.getInternalPlayer() : player;
    if (internal && typeof internal.currentTime === "number") {
      return internal.currentTime;
    }

    return null;
  }, []);

  // --- Updated controls using the safe helpers ---
  async function handleRewind() {
    try {
      const current = await safeGetCurrentTime();
      if (typeof current !== "number" || Number.isNaN(current)) return;
      safeSeekTo(Math.max(0, current - 5), "seconds");
    } catch (err) {
      console.error("Error rewinding:", err);
    }
  }

  async function handleForward() {
    try {
      const current = await safeGetCurrentTime();
      if (typeof current !== "number" || Number.isNaN(current)) return;
      const duration = safeGetDuration() || 0;
      safeSeekTo(Math.min(duration, current + 5), "seconds");
    } catch (err) {
      console.error("Error forwarding:", err);
    }
  }

  function handleToggleMute() {
    setMuted((m) => !m);
  }

  function handleSeekChange(newValue) {
    // newValue is expected as fraction array [0..1] in your current setup
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    // user released the slider: seek using fraction type
    setSeeking(false);
    safeSeekTo(played, "fraction");
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current?.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (played === 1 && typeof onProgressUpdate === "function") {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played, onProgressUpdate, progressData]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        src={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-4 [&_[data-orientation=horizontal]>.bg-primary]:bg-white
             [&_[data-orientation=horizontal]>.bg-secondary]:bg-gray-600
             [&_[data-orientation=horizontal]_.slider-thumb]:bg-white"
             
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className="w-24 [&_[data-orientation=horizontal]>.bg-primary]:bg-white
             [&_[data-orientation=horizontal]>.bg-secondary]:bg-gray-600
             [&_[data-orientation=horizontal]_.slider-thumb]:bg-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white">
                {formatTime(played * safeGetDuration())}/{formatTime(safeGetDuration())}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
