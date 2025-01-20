import dayjs from "dayjs";
import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";
import CountCircle from "@/components/CountCircle";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <CountCircle duration={dayjs(8, "hours").valueOf()} />
      <Text>Hello world!</Text>
    </View>
  );
}
