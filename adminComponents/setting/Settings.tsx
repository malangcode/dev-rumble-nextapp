"use client";

import { useState } from "react";
import {
  Store, Clock, Bell, CreditCard, Utensils, Users,
  FileText, Building, Shield, Monitor

} from "lucide-react";

const CanteenSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [generalSettings, setGeneralSettings] = useState({
    canteenName: "Campus Canteen",
    tagline: "Fresh Food, Happy Students",
    phone: "",
    email: "",
    taxRate: "13",
    currency: "NPR",
    timezone: "Asia/Kathmandu"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "hours", label: "Hours", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "kitchen", label: "Kitchen", icon: Utensils },
    { id: "users", label: "Users", icon: Users },
    { id: "menu", label: "Menu", icon: FileText },
    { id: "tables", label: "Tables", icon: Building },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Monitor }
  ];

  const handleSave = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000));
    setSavedMessage("Settings saved!");
    setLoading(false);
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Canteen Settings</h1>
      <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded ${
              activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-white"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
          </button>
        ))}
      </div>

      {savedMessage && <p className="text-green-500">{savedMessage}</p>}

      {activeTab === "general" && (
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="border p-2 rounded"
            value={generalSettings.canteenName}
            onChange={(e) => setGeneralSettings({...generalSettings, canteenName: e.target.value})}
            placeholder="Canteen Name"
          />
          <input
            className="border p-2 rounded"
            value={generalSettings.tagline}
            onChange={(e) => setGeneralSettings({...generalSettings, tagline: e.target.value})}
            placeholder="Tagline"
          />
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-2">
          {Object.keys(notificationSettings).map(key => (
            <label key={key} className="flex items-center justify-between">
              <span>{key.replace(/([A-Z])/g, ' $1')}</span>
              <input
                type="checkbox"
                checked={notificationSettings[key as keyof typeof notificationSettings]}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings, [key as keyof typeof notificationSettings]: e.target.checked
                })}
              />
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default CanteenSettings;
