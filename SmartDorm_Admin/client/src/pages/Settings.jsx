import React, { useState } from "react";
import { User, Lock, Bell, Brush } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Saved successfully!");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center mb-6">Settings</h1>

      {/* Layout */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white border rounded-xl p-4 col-span-1 shadow-sm">
          <div className="flex flex-col space-y-1">
            {[
              { key: "profile", label: "Profile", icon: <User size={16} /> },
              { key: "security", label: "Security", icon: <Lock size={16} /> },
              {
                key: "notifications",
                label: "Notifications",
                icon: <Bell size={16} />,
              },
              {
                key: "appearance",
                label: "Appearance",
                icon: <Brush size={16} />,
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md transition ${
                  activeTab === item.key
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border rounded-xl p-6 col-span-3 shadow-sm">
          {activeTab === "profile" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="+84..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Enter address"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <div className="text-sm text-gray-600">
              <h2 className="text-lg font-medium mb-3">Security Settings</h2>
              <p>
                Change password, enable two-factor authentication, and manage
                sessions.
              </p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="text-sm text-gray-600">
              <h2 className="text-lg font-medium mb-3">
                Notification Settings
              </h2>
              <p>Manage your email and in-app notification preferences.</p>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="text-sm text-gray-600">
              <h2 className="text-lg font-medium mb-3">Appearance</h2>
              <p>
                Switch between light and dark modes or adjust UI preferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
