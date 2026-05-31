"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (status === "loading") return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#080d1a" }}>
      <div style={{ color: "#6366f1", fontSize: 16 }}>Loading...</div>
    </div>
  );

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
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

  const user = session?.user;
  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      <div style={{ width: sidebarOpen ? 240 : 72, background: "white", boxShadow: "2px 0 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", transition: "width 0.3s" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && <span style={{ fontWeight: 900, fontSize: 18, color: "#1e293b" }}>FleetMind</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#64748b" }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {navigation.map(item => (
            <Link key={item.name} href={item.href}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", marginBottom: 2, borderRadius: 8, textDecoration: "none", background: pathname === item.href ? "#ede9fe" : "none", color: pathname === item.href ? "#6366f1" : "#475569", fontWeight: pathname === item.href ? 600 : 400, fontSize: 14 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {sidebarOpen && item.name}
            </Link>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{userInitial}</div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ width: "100%", padding: "8px 12px", background: "none", border: "1px solid #fecaca", borderRadius: 8, color: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              Sign Out
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "16px 24px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Welcome back, {user?.name?.split(" ")[0] || "User"}!</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Manage your fleet operations</div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
