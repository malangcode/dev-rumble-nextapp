"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Search, 
  Users, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical,
  Plus,
  Settings,
  Bell,
  User,
  Hash,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  type: 'buddy' | 'group';
  avatar: string;
  lastMessage?: string;
  lastSeen: Date;
  unreadCount: number;
  isOnline?: boolean;
  members?: number;
}

export default function ChatPlatform() {
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'buddies' | 'groups'>('buddies');
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sample data
  const buddies: Chat[] = [
    {
      id: "1",
      name: "Rahis Sheikh",
      type: "buddy",
      avatar: "/images/profile2.jpg",
      lastMessage: "Hey! Ready for our JavaScript study session?",
      lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      unreadCount: 2,
      isOnline: true
    },
    {
      id: "2", 
      name: "Sangam",
      type: "buddy",
      avatar: "/images/profile2.jpg",
      lastMessage: "Thanks for the React notes! 🙏",
      lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      unreadCount: 0,
      isOnline: false
    },
    {
      id: "3",
      name: "Bibek",
      type: "buddy", 
      avatar: "/images/profile2.jpg",
      lastMessage: "Can we review the algorithms together?",
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 1,
      isOnline: true
    }
  ];

  const groups: Chat[] = [
    {
      id: "g1",
      name: "Team MalangCode",
      type: "group",
      avatar: "/images/group.png",
      lastMessage: "Alex: Anyone up for a coding challenge?",
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 5,
      members: 12
    },
    {
      id: "g2",
      name: "Data Science Team",
      type: "group", 
      avatar: "/images/group.png",
      lastMessage: "Lisa: Check out this ML tutorial",
      lastSeen: new Date(Date.now() - 60 * 60 * 1000),
      unreadCount: 0,
      members: 8
    },
    {
      id: "g3",
      name: "Study Group Alpha",
      type: "group",
      avatar: "/images/group.png",
      lastMessage: "You: Meeting at 3 PM today",
      lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 3,
      members: 6
    }
  ];

  const messages: { [chatId: string]: Message[] } = {
    "1": [
      {
        id: "m1",
        sender: "Sarah Chen",
        senderId: "sarah123",
        content: "Hey! Ready for our JavaScript study session?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: "text",
        status: "read"
      },
      {
        id: "m2", 
        sender: "You",
        senderId: "you",
        content: "Absolutely! I've prepared some questions about closures and async/await",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: "text",
        status: "read"
      },
      {
        id: "m3",
        sender: "Sarah Chen", 
        senderId: "sarah123",
        content: "Perfect! I was struggling with promises yesterday. Your help would be amazing 🤓",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: "text",
        status: "delivered"
      }
    ],
    "g1": [
      {
        id: "gm1",
        sender: "Alex Kim",
        senderId: "alex456", 
        content: "Anyone up for a coding challenge? I found this interesting algorithm problem",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: "text",
        status: "read"
      },
      {
        id: "gm2",
        sender: "Maya Patel",
        senderId: "maya789",
        content: "Count me in! What's the difficulty level?",
        timestamp: new Date(Date.now() - 12 * 60 * 1000), 
        type: "text",
        status: "read"
      },
      {
        id: "gm3",
        sender: "You",
        senderId: "you",
        content: "I'm interested too! Share the problem link",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: "text", 
        status: "sent"
      }
    ]
  };

  const currentChat = [...buddies, ...groups].find(chat => chat.id === activeChat);
  const currentMessages = activeChat ? (messages[activeChat] || []) : [];

  const filteredChats = (activeTab === 'buddies' ? buddies : groups).filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 1000) return "now";
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: "You",
      senderId: "you", 
      content: message.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sent"
    };

    // In real app, send to backend
    console.log("Sending message:", newMessage);
    setMessage("");
    
    // Auto scroll to bottom
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen p-8 w-full justify-center items-center">
      <div className="flex w-full h-full max-w-7xl rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-10">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('buddies')}
              className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'buddies'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              Buddies
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'groups'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Hash className="w-4 h-4" />
              Groups
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                activeChat === chat.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.type === 'buddy' && chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                {chat.type === 'group' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                    <Users className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatTime(chat.lastSeen)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-1">
                  {chat.type === 'group' && (
                    <span className="text-xs text-gray-500">
                      {chat.members} members
                    </span>
                  )}
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center ml-auto">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Chat */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            {activeTab === 'buddies' ? 'Find Study Buddy' : 'Join Group'}
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={currentChat.avatar}
                      alt={currentChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {currentChat.type === 'buddy' && currentChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentChat.name}</h2>
                    <p className="text-sm text-gray-500">
                      {currentChat.type === 'buddy' 
                        ? (currentChat.isOnline ? 'Online' : `Last seen ${formatTime(currentChat.lastSeen)}`)
                        : `${currentChat.members} members`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg, index) => {
                const isCurrentUser = msg.senderId === "you";
                const showAvatar = !isCurrentUser && (
                  index === 0 || 
                  currentMessages[index - 1].senderId !== msg.senderId
                );
                const showName = !isCurrentUser && showAvatar && currentChat.type === 'group';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="w-8 h-8 flex-shrink-0">
                        {showAvatar && (
                          <img
                            src="/images/profile2.jpg"
                            alt={msg.sender}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                      {showName && (
                        <span className="text-xs text-gray-500 mb-1 px-3">
                          {msg.sender}
                        </span>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-1 ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      }`}>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                        {isCurrentUser && (
                          <div className="text-gray-400">
                            {msg.status === 'sent' && <Check className="w-3 h-3" />}
                            {msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                            {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${currentChat.name}...`}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-full transition-all ${
                    message.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Learning Chat
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with your study buddies and team members
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start a conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}