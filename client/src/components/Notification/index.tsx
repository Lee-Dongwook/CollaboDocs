"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { removeNotification } from "@/store/notificationSlice";

export default function Notification() {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );

  const timer = setTimeout(() => {
    dispatch(removeNotification(notifications[0].id), 4000);
  });

  useEffect(() => {
    if (notifications.length > 0) {
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, dispatch]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          } text-white`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}
