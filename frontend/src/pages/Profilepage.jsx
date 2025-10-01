import React, { useState } from "react";


const states = [
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Delhi",
];
const countryCodes = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
];

export default function Profilepage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "demo_user",
    email: "demo@cleanstreet.com",
    fullName: "Demo User",
    phoneCode: "+1",
    phoneNumber: "555-123-4567",
    location: "Downtown District",
    bio: "Active citizen helping to improve our community through CleanStreet reporting.",
    memberSince: "2025-07-03",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Avatar initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Navbar */}
      <header className="w-full bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">cleanStreet</h1>
        <div className="space-x-6 flex items-center">
          <a href="/login" className="text-gray-900 font-medium">
            Sign out
          </a>
          <button className="px-5 py-2 bg-[#0a2463] text-white font-medium rounded-md hover:bg-[#081b4a] transition">
            Register
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Manage your account information and preferences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Sidebar */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-5 relative">
              {getInitials(profile.fullName)}
              <button className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0L21 10.586a1 1 0 010 1.414L14.707 18H9v-5z"
                  />
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
            <p className="text-gray-500">@{profile.username}</p>
            <span className="mt-3 bg-blue-100 text-blue-600 text-sm font-medium px-4 py-1 rounded-full">
              Citizen
            </span>
            <p className="text-center text-gray-600 mt-4 text-sm">
              {profile.bio}
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Member since {profile.memberSince}
            </p>
          </div>

          {/* Right Section */}
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Account Information</h2>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                onClick={() => setIsEditing(!isEditing)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0L21 10.586a1 1 0 010 1.414L14.707 18H9v-5z"
                  />
                </svg>
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            {/* Account Info Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md text-lg ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md text-lg ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md text-lg ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="flex">
                  <select
                    name="phoneCode"
                    value={profile.phoneCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`p-3 border rounded-l-md text-lg ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full p-3 border rounded-r-md text-lg ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                {isEditing ? (
                  <select
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md text-lg bg-white"
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={profile.location}
                    readOnly
                    className="w-full p-3 border rounded-md text-lg bg-gray-100"
                  />
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium mb-2">Member Since</label>
                <input
                  type="date"
                  name="memberSince"
                  value={profile.memberSince}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md text-lg ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full p-3 border rounded-md h-28 text-lg ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
