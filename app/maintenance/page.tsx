"use client";

import { useState } from "react";

export default function MaintenancePage() {
  const [tasks] = useState([
    { id: 1, vehicle: "Truck 101", task: "Oil Change", dueDate: "2024-06-20", priority: "High", status: "Pending", cost: 150 },
    { id: 2, vehicle: "Truck 102", task: "Brake Inspection", dueDate: "2024-06-18", priority: "Critical", status: "Overdue", cost: 200 },
    { id: 3, vehicle: "Van 203", task: "Tire Rotation", dueDate: "2024-06-25", priority: "Medium", status: "Scheduled", cost: 80 },
    { id: 4, vehicle: "Truck 101", task: "Engine Tune-up", dueDate: "2024-06-22", priority: "High", status: "Pending", cost: 450 },
  ]);

  const overdueCount = tasks.filter(t => t.status === "Overdue").length;
  const dueSoonCount = tasks.filter(t => t.status === "Pending" || t.status === "Scheduled").length;
  const pendingCount = tasks.filter(t => t.status !== "Completed").length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Maintenance Scheduling</h1>
        <p className="text-gray-500 text-sm mt-1">Track and schedule vehicle maintenance tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Overdue</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{overdueCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Due Soon</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{dueSoonCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">0</p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
          + Schedule Maintenance
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Task</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{task.vehicle}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{task.task}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{task.dueDate}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`text-${task.priority === 'Critical' ? 'red' : task.priority === 'High' ? 'orange' : 'yellow'}-600`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                    task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">R{task.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}