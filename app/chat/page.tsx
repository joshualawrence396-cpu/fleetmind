"use client";

import { useState } from "react";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  
  const users = [
    { id: 1, name: "Josh", role: "Driver", online: true },
    { id: 2, name: "Jake", role: "Driver", online: true },
    { id: 3, name: "John Driver", role: "Driver", online: false },
    { id: 4, name: "Mike Smith", role: "Driver", online: true },
    { id: 5, name: "Sarah Johnson", role: "Dispatcher", online: true },
  ];

  const [messages, setMessages] = useState([
    { id: 1, userId: 1, text: "Hello, what's my next delivery?", time: "10:30 AM", isOwn: false },
    { id: 2, userId: 1, text: "You have a pickup at Smith Warehouse", time: "10:32 AM", isOwn: true },
    { id: 3, userId: 2, text: "I'm running late", time: "09:15 AM", isOwn: false },
    { id: 4, userId: 2, text: "No problem, take your time", time: "09:16 AM", isOwn: true },
  ]);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    setMessages([...messages, {
      id: messages.length + 1,
      userId: selectedUser.id,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    }]);
    setMessage("");
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time messaging with drivers and team members</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Contacts Sidebar */}
          <div className="border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-800">Contacts</h3>
            </div>
            <div className="overflow-y-auto h-[calc(600px-57px)]">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 text-left hover:bg-gray-100 transition border-b border-gray-100 ${
                    selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                    </div>
                    {user.online && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-white">
                  <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedUser.online ? 'Online' : 'Offline'}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages
                    .filter(m => m.userId === selectedUser.id)
                    .map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.isOwn 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.isOwn ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <p className="text-gray-400 text-base mb-2">Select a user to start chatting</p>
                  <p className="text-gray-400 text-sm">Choose a contact from the left to begin messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}