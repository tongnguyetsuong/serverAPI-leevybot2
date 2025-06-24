"use client";
import {
  Bell,
  BotIcon,
  Code,
  Computer,
  MessageCircle,
  Shield,
  UserIcon,
} from "lucide-react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import loading from "../../public/loading.gif";
type NotiData = {
  type: "info" | "success" | "warning" | "error";
  message: string;
  role: "user" | "bot";
  createdAt: string;
};
type ConfigData = {
  serverConnect: number;
  totalMessage: number;
  totalCommand: number;
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")} - ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
};
// Component con cho thẻ thống kê
import { ElementType } from "react";

const StatCard = ({
  icon: Icon,
  value,
  label,
  gradient,
  iconColor,
  valueColor,
  labelColor,
}: {
  icon: ElementType;
  value: string | number;
  label: string;
  gradient: string;
  iconColor: string;
  valueColor: string;
  labelColor: string;
}) => (
  <div
    className={`p-2 md:p-4 flex gap-x-4 items-center rounded-xl ${gradient}`}
  >
    <Icon size={30} className={iconColor} />
    <div className="flex flex-col">
      <span className={`text-4xl ${valueColor}`}>{value}</span>
      <span className={`text-sm ${labelColor}`}>{label}</span>
    </div>
  </div>
);

function Notification() {
  const [notifications, setNotifications] = useState<NotiData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configs, setConfigs] = useState<ConfigData>({
    serverConnect: 2,
    totalCommand: 40,
    totalMessage: 23000,
  });
  const [stats, setStats] = useState<
    Array<{
      icon: ElementType;
      value: string | number;
      label: string;
      gradient: string;
      iconColor: string;
      valueColor: string;
      labelColor: string;
    }>
  >([]);
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<NotiData[]>("/api/notification");
      setNotifications(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Không thể tải thông báo. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(); // Gọi lần đầu khi mount
    const interval = setInterval(fetchNotifications, 5000); // Gọi mỗi 5 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi unmount
  }, [fetchNotifications]);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ConfigData>("/api/config");
      setConfigs(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Không thể tải thông báo. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchConfig(); // Gọi lần đầu khi mount
    const interval = setInterval(fetchConfig, 5000); // Gọi mỗi 5 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi unmount
  }, [fetchConfig]);

  // Dữ liệu giả cho thống kê (thay bằng API nếu có)
  useEffect(() => {
    setStats([
      {
        icon: Computer,
        value: configs.serverConnect.toLocaleString(),
        label: "Server kết nối",
        gradient: "bg-gradient-to-br from-cyan-200 to-white",
        iconColor: "text-cyan-900",
        valueColor: "text-cyan-900",
        labelColor: "text-cyan-600",
      },
      {
        icon: MessageCircle,
        value: configs.totalMessage.toLocaleString(),
        label: "Tin nhắn",
        gradient: "bg-gradient-to-br from-yellow-200 to-white",
        iconColor: "text-yellow-900",
        valueColor: "text-yellow-900",
        labelColor: "text-yellow-600",
      },
      {
        icon: Code,
        value: configs.totalCommand.toLocaleString(),
        label: "Lệnh",
        gradient: "bg-gradient-to-br from-green-200 to-white",
        iconColor: "text-green-900",
        valueColor: "text-green-900",
        labelColor: "text-green-600",
      },
    ]);
  }, [configs, setStats]);

  return (
    <div className="p-4 md:p-10 flex flex-col gap-y-3 md:h-screen">
      <div className="text-3xl flex items-center gap-x-2 font-bold mb-4">
        <Shield size={30} className="text-cyan-400" />
        <p className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          ADMIN
        </p>
        {isLoading && (
          <Image src={loading} alt="loading" width={24} height={24} />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-2xl overflow-y-scroll h-[500px] md:h-full">
        {error && <p className="text-red-500">{error}</p>}
        {notifications.length === 0 && !isLoading && !error && (
          <div className="flex items-center justify-center flex-col h-full w-full">
            <Bell size={50} />
            <p className="text-sm text-gray-500">Không có thông báo</p>
          </div>
        )}
        <ul className="space-y-2">
          {notifications.toReversed().map((noti, index) => (
            <li
              key={index}
              className={`p-2 rounded-2xl border  bg-white
                ${
                  noti.type === "success"
                    ? "bg-gradient-to-br to-green-100 border-green-300 from-white"
                    : noti.type === "error"
                    ? "bg-gradient-to-br to-red-100 from-white border-red-300"
                    : noti.type === "warning"
                    ? " bg-gradient-to-br to-yellow-100 from-white border-yellow-300"
                    : "bg-gradient-to-br to-blue-100 from-white border-blue-300 "
                }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <div
                    className={`max-w-max px-3 py-1 text-white rounded-full text-sm ${
                      noti.type === "success"
                        ? "bg-green-500"
                        : noti.type === "error"
                        ? "bg-red-500 "
                        : noti.type === "warning"
                        ? "bg-yellow-500 "
                        : "bg-blue-500 "
                    }`}
                  >
                    {noti.type === "success"
                      ? "Ổn định"
                      : noti.type === "error"
                      ? "Lỗi"
                      : noti.type === "warning"
                      ? "Cảnh báo"
                      : "Thông tin"}
                  </div>
                  <span className="text-sm  text-gray-500">
                    {formatDate(noti.createdAt)}
                  </span>
                </div>
                <div className="flex gap-x-3 items-center">
                  <span className="p-1 rounded-full  bg-gray-700 text-white">
                    {noti.role === "user" ? <UserIcon /> : <BotIcon />}
                  </span>
                  <p>{noti.message} </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notification;
