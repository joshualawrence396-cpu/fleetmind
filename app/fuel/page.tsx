"use client";

import DashboardLayout from "../dashboard-layout";

function FuelContent() {
  const [fuelLogs] = useState([
    { id: 1, date: "2024-06-15", vehicle: "Truck 101", driver: "John Smith", liters: 245.5, cost: 4850.50, station: "Shell Midrand" },
    { id: 2, date: "2024-06-14", vehicle: "Truck 102", driver: "Mike Johnson", liters: 312.8, cost: 6180.80, station: "BP Sandton" },
    { id: 3, date: "2024-06-13", vehicle: "Van 203", driver: "Sarah Williams", liters: 156.3, cost: 3086.93, station: "Total Rivonia" },
  ]);

  const totalCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
  const avgPrice = totalCost / totalLiters;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Total Cost</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">R{totalCost.toLocaleString()}</p>
          <p className="text-green-600 text-xs mt-2">? 12% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Total Liters</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalLiters.toFixed(1)} L</p>
          <p className="text-red-600 text-xs mt-2">? 5% consumption</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Avg Price/Liter</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">R{avgPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-gray-500 text-sm">Transactions</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{fuelLogs.length}</p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">+ Add Fuel Log</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Liters</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cost</th>
            </tr>
          </thead>
          <tbody>
            {fuelLogs.map((log, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3 text-sm">{log.date}</td>
                <td className="px-4 py-3 text-sm font-medium">{log.vehicle}</td>
                <td className="px-4 py-3 text-sm">{log.driver}</td>
                <td className="px-4 py-3 text-sm">{log.liters} L</td>
                <td className="px-4 py-3 text-sm font-semibold">R{log.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from "react";
export default function FuelPage() {
  return (
    <DashboardLayout>
      <FuelContent />
    </DashboardLayout>
  );
}
