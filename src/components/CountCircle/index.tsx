import useCountDown from "@/hooks/useCountDown";
import React, { useEffect } from "react";
import "./index.scss";

const CountCircle: React.FC<{ duration: number }> = ({ duration }) => {
  const { countdown: timeLeft, start } = useCountDown({ duration });

  useEffect(() => {
    start(); // 启动倒计时
  }, [start]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="count-circle">
      <div
        className="circle"
        style={{
          background: `conic-gradient(pink ${percentage}%, lightgray ${percentage}%)`,
        }}
      >
        <div className="timer">{timeLeft}s</div>
      </div>
    </div>
  );
};

export default CountCircle;
