import useCountDown from "@/hooks/useCountDown";
import React, { useEffect } from "react";
import "./index.scss";
import { View } from "@tarojs/components";

const CountCircle: React.FC<{ duration: number }> = ({ duration }) => {
  const { countdown: timeLeft, start } = useCountDown({ duration });

  useEffect(() => {
    start(); // 启动倒计时
  }, []);

  const percentage = (timeLeft / duration) * 100;

  const hours = Math.floor((timeLeft / 1000 / 3600) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <View className="count-circle mt-4">
      <View
        className="circle"
        style={{
          background: `conic-gradient(pink ${percentage}%, lightgray ${percentage}%)`,
        }}
      >
        <View className="timer">{`${hours}:${minutes}:${seconds}`}</View>
      </View>
    </View>
  );
};

export default CountCircle;
