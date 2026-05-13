"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not authenticated
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Drivers", href: "/drivers", icon: "👨‍✈️" },
    { name: "Orders", href: "/orders", icon: "📦" },
    { name: "Warehouses", href: "/warehouses", icon: "🏭" },
    { name: "Inventory", href: "/inventory", icon: "📋" },
    { name: "Fuel", href: "/fuel", icon: "⛽" },
    { name: "Maintenance", href: "/maintenance", icon: "🔧" },
    { name: "Notifications", href: "/notifications", icon: "🔔" },
    { name: "Chat", href: "/chat", icon: "💬" },
  ];

  const userInitial = user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl text-gray-800">FleetMind</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 mb-1 rounded-lg transition ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userInitial}
              </div>
            )}
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {user?.fullName || user?.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.emailAddresses?.[0]?.emailAddress || "user@example.com"}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => router.push("/sign-out")}
              className="mt-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.firstName || "User"}!
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage your fleet operations</p>
            </div>
            {!sidebarOpen && (
              <button
                onClick={() => router.push("/sign-out")}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
