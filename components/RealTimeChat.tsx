'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  from: string
  to: string
  message: string
  timestamp: string
  read: boolean
}

interface ChatUser {
  id: string
  name: string
  role: string
  online: boolean
}

export function RealTimeChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [users, setUsers] = useState<ChatUser[]>([])
  const [showChat, setShowChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUsers()
    loadMessages()

    // Poll for new messages every 10 seconds
    const interval = setInterval(() => {
      loadMessages()
      loadUsers()
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/chat/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const loadMessages = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/chat/messages?user=${selectedUser.id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedUser.id,
          message: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage('')
        loadMessages() // Refresh messages
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/chat/messages/${messageId}/read`, {
        method: 'PUT'
      })
      loadMessages() // Refresh to show updated read status
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }

  const getUnreadCount = (userId: string) => {
    return messages.filter(m => m.from === userId && !m.read).length
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        💬
        {messages.filter(m => !m.read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {messages.filter(m => !m.read).length > 99 ? '99+' : messages.filter(m => !m.read).length}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border z-40 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedUser ? `Chat with ${selectedUser.name}` : 'Fleet Chat'}
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {!selectedUser ? (
            /* User Selection */
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Select a user to chat with:</h4>
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {getUnreadCount(user.id) > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getUnreadCount(user.id)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.from === 'current-user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                        onClick={() => message.from !== 'current-user' && !message.read && markAsRead(message.id)}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div className={`text-xs mt-1 ${message.from === 'current-user' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                          {message.from !== 'current-user' && !message.read && (
                            <span className="ml-2 text-blue-500">●</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                >
                  ← Back to users
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}