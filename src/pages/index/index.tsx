import CountCircle from "@/components/CountCircle";
import dayjs from "dayjs";
import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View>
      <CountCircle duration={16 * 60 * 60 * 1000} />
    </View>
  );
}
