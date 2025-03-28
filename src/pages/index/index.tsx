import { useEffect, useState } from "react";
import { View, Text, Image, Button, Picker } from "@tarojs/components";
import Play from "@/assets/play.svg";
import Clock from "@/assets/clock.svg";
import Calender from "@/assets/calendar.svg";
import Trophy from "@/assets/trophy.svg";
import AlertCircle from "@/assets/circle-alert.svg";
import AlertCircleGreen from "@/assets/circle-alert-green.svg";

import "./index.scss";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { SwipeCell } from "@taroify/core";

// 断食计划类型
interface FastingPlan {
  id: string;
  fastingRatio: string;
  fastingHours: number;
  eatingHours: number;
}

// 断食记录类型
interface FastingRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export function useStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const cached = Taro.getStorageSync(key);
    return cached ? JSON.parse(cached) : initialValue;
  });

  useEffect(() => {
    if (state === null) {
      Taro.removeStorageSync(key);
    } else {
      Taro.setStorageSync(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] as const;
}

export default function Index() {
  // 状态管理
  const [fastingPlans] = useState<FastingPlan[]>([
    { id: "16:8", fastingRatio: "16:8", fastingHours: 16, eatingHours: 8 },
    { id: "18:6", fastingRatio: "18:6", fastingHours: 18, eatingHours: 6 },
    { id: "20:4", fastingRatio: "20:4", fastingHours: 20, eatingHours: 4 },
  ]);

  const [selectedPlan, setSelectedPlan] = useStorageState<FastingPlan | null>(
    "selectedPlan",
    null
  );
  const [currentFasting, setCurrentFasting] =
    useStorageState<FastingRecord | null>("currentFasting", null);
  const [fastingRecords, setFastingRecords] = useStorageState<FastingRecord[]>(
    "fastingRecords",
    []
  );
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [consecutiveDays, setConsecutiveDays] = useStorageState<number>(
    "consecutiveDays",
    0
  );
  const [customStartTime, setCustomStartTime] = useState<string>("");

  // 开始断食
  const startFasting = (plan: FastingPlan) => {
    let startMoment = dayjs();

    if (customStartTime) {
      const [hours, minutes] = customStartTime.split(":").map(Number);
      startMoment = dayjs().hour(hours).minute(minutes).second(0);
    }

    const endMoment = startMoment.add(plan.fastingHours, "hour");

    const newFasting: FastingRecord = {
      id: startMoment.toISOString(),
      date: startMoment.format("YYYY/MM/DD"),
      startTime: startMoment.toISOString(),
      endTime: endMoment.toISOString(),
      completed: false,
    };

    setSelectedPlan(plan);
    setCurrentFasting(newFasting);
    setCustomStartTime("");
  };

  // 结束断食
  const endFasting = () => {
    if (currentFasting) {
      const now = dayjs();
      const plannedEndTime = dayjs(currentFasting.endTime);
      const diffInMinutes = Math.abs(plannedEndTime.diff(now, "minute"));
      const completedFasting = {
        ...currentFasting,
        endTime: now.toISOString(),
        completed: diffInMinutes <= 30,
      };

      setFastingRecords((prev) => [completedFasting, ...prev]);

      const lastRecord = fastingRecords[0];
      const currentDate = dayjs(currentFasting.date);
      const isConsecutive =
        lastRecord &&
        dayjs(lastRecord.date).add(1, "day").isSame(currentDate, "day");

      setConsecutiveDays((prev) => (isConsecutive ? prev + 1 : 1));
      setCurrentFasting(null);
      setSelectedPlan(null);
    }
  };

  const deleteRecord = (recordId: string) => {
    console.log("deleting");
    setFastingRecords((prev) =>
      prev.filter((record) => record.id !== recordId)
    );
  };

  // 更新倒计时
  useEffect(() => {
    if (!currentFasting) return;

    const timer = setInterval(() => {
      const now = dayjs();
      const end = dayjs(currentFasting.endTime);
      const diff = end.diff(now, "second");

      if (diff <= 0) {
        clearInterval(timer);
        endFasting();
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentFasting, endFasting]);

  return (
    <View>
      <View className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-8 px-[24rpx]">
        <View className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 标题栏 */}
          <View className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 flex items-center justify-between">
            <View className="text-2xl font-bold tracking-wide">轻断食助手</View>
            {/* <Settings className="w-6 h-6 text-white/80 hover:text-white transition-colors" /> */}
          </View>

          {/* 主内容区 */}
          <View className="py-6 px-[48rpx]">
            {currentFasting ? (
              <View className="text-center">
                <View className="bg-blue-100 rounded-xl p-6 mb-6 shadow-inner">
                  <Image
                    src={Clock}
                    svg={true}
                    className="mx-auto mb-4 text-blue-600 w-16 h-16"
                  />
                  <View className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedPlan?.fastingRatio} 间歇性断食
                  </View>
                  <View className="text-gray-600 mb-2">
                    开始时间:{" "}
                    {dayjs(currentFasting.startTime).format("HH:mm:ss")}
                  </View>
                  <View className="text-4xl font-bold text-blue-600 mb-4">
                    {timeRemaining}
                  </View>
                  <Button
                    onClick={endFasting}
                    className="bg-red-500 text-white leading-none px-6 py-3 rounded-full flex items-center justify-center"
                  >
                    结束断食
                  </Button>
                </View>
              </View>
            ) : (
              <View>
                <View className="mb-6 bg-gray-100 rounded-xl p-4 shadow-inner">
                  <View className="block text-gray-700 mb-2 font-semibold">
                    自定义断食开始时间
                  </View>
                  <Picker
                    mode="time"
                    value={customStartTime}
                    defaultValue={dayjs().format("HH:mm")}
                    onChange={(e) => setCustomStartTime(e.detail.value)}
                  >
                    <View className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-white hover:border-blue-300 transition-colors flex items-center justify-between">
                      <Text className="text-gray-700">
                        {customStartTime || "请选择时间"}
                      </Text>
                    </View>
                  </Picker>
                </View>

                <View className="flex flex-col gap-y-3">
                  {fastingPlans.map((plan) => (
                    <View
                      key={plan.id}
                      onClick={() => customStartTime && startFasting(plan)}
                      className={`w-full px-4 py-2 rounded-lg text-base font-medium
                        ${
                          !customStartTime
                            ? "bg-gray-300 text-gray-500"
                            : "bg-blue-500 text-white"
                        }`}
                    >
                      <Image
                        src={Play}
                        className="inline-block mr-2 w-[18px] h-[18px]"
                      />
                      开始 {plan.fastingRatio} 断食
                    </View>
                  ))}
                  {!customStartTime && (
                    <View className="text-red-500 text-center text-sm">
                      请先选择开始时间
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* 连续打卡 */}
          <View className="bg-blue-50 p-5 flex items-center">
            <Image src={Trophy} className="w-12 h-12 text-yellow-500 mr-4" />
            <View>
              <View className="font-bold text-gray-800">连续打卡</View>
              <View className="text-2xl font-bold text-blue-600">
                {consecutiveDays} 天
              </View>
            </View>
          </View>

          {/* 记录列表 */}
          <View className="py-6 px-[48rpx]">
            <View className="flex items-center mb-4">
              <Image src={Calender} className="mr-2 text-green-500 w-4 h-4" />
              <View className="font-bold text-gray-800">历史记录</View>
            </View>
            {fastingRecords.length === 0 ? (
              <View className="text-gray-500 text-center">暂无记录</View>
            ) : (
              <View className="flex flex-col gap-y-3">
                {fastingRecords.map((record) => (
                  <SwipeCell key={record.id}>
                    <View className="bg-gray-100 p-4 flex justify-between items-center">
                      <View>
                        <View className="font-semibold text-gray-700">
                          {record.date}
                        </View>
                        <View className="text-sm text-gray-500">
                          {dayjs(record.startTime).format("HH:mm:ss")} -{" "}
                          {dayjs(record.endTime).format("HH:mm:ss")}
                        </View>
                      </View>
                      {record.completed ? (
                        <Image
                          src={AlertCircleGreen}
                          className="text-green-500 w-6 h-6"
                        />
                      ) : (
                        <Image
                          src={AlertCircle}
                          className="text-red-500 w-6 h-6"
                        />
                      )}
                    </View>
                    <SwipeCell.Actions side="right">
                      <Button
                        className=" bg-red-500 rounded-none text-white px-4 flex items-center justify-center"
                        onClick={() => {
                          Taro.showModal({
                            title: "确认删除",
                            content: "是否确认删除该记录？",
                            success: function (res) {
                              if (res.confirm) {
                                deleteRecord(record.id);
                              }
                            },
                          });
                        }}
                      >
                        删除
                      </Button>
                    </SwipeCell.Actions>
                  </SwipeCell>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
