"use client";

import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Low Fuel Alert", message: "Truck 101 fuel level below 15%", time: "5 minutes ago", unread: true },
    { id: 2, title: "Delivery Completed", message: "Order #ORD-1234 has been delivered", time: "1 hour ago", unread: true },
    { id: 3, title: "Maintenance Reminder", message: "Truck 102 scheduled for oil change", time: "2 hours ago", unread: false },
    { id: 4, title: "Route Deviation", message: "Vehicle deviated from planned route", time: "3 hours ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Stay updated with fleet alerts and messages</p>
        </div>
        <button className="text-blue-600 text-sm hover:text-blue-700">
          Mark all read
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Unread</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Total Alerts</p>
          <p className="text-2xl font-bold text-red-600 mt-1">2</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Total Notifications</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{notifications.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className={`bg-white rounded-lg shadow border p-4 ${notif.unread ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                  {notif.unread && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                <p className="text-xs text-gray-400">{notif.time}</p>
              </div>
              {notif.unread && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 ml-4"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}