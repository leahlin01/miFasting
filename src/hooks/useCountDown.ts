import { useEffect, useRef, useState } from "react";

function useCountDown({ duration = 60000, interval = 1000 }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 开始倒计时
  const start = () => {
    intervalRef.current = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - interval);
      } else {
        pause();
      }
    }, interval);
  };

  // 暂停倒计时
  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 重置倒计时
  const reset = () => {
    pause();
    setTimeLeft(duration);
  };

  // 清除倒计时
  useEffect(() => {
    return () => {
      pause();
    };
  }, []);

  return { countdown: timeLeft, start, pause, reset };
}

export default useCountDown;
