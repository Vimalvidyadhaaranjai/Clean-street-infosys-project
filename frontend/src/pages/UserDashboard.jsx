import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaThumbsUp,
  FaUserShield,
} from "react-icons/fa";
const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reports");

  const tabs = [
    { id: "reports", label: "My Reports" },
    { id: "profile", label: "Profile" },
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";
  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="font-inter text-gray-800 p-6 mt-8">
        {/* Header */}
        <div className="flex justify-between items-center my-8">
          <div>
            <h1 className="text-3xl font-bold">{user ? user.name : "Guest"}</h1>
            <p className="text-gray-600">
              Welcome back! Track your reports and community impact
            </p>
          </div>

          <button className="bg-[#14213D] text-white px-5 py-2 rounded-lg shadow hover:bg-blue-900 w-full sm:w-auto text-center">
            + Report Issue
          </button>
        </div>

        {/* Stats Section */}
        <div className="px-6 mt-10">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {/* Reports Filed */}
            <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">

              <FaClipboardList className="text-5xl text-[#14213D] mb-3" />
              <p className="text-3xl font-bold">3</p>
              <p className="text-gray-600 text-lg">Reports Filed</p>
            </div>

            {/* Resolved */}
            <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">

              <FaCheckCircle className="text-5xl text-green-600 mb-3" />
              <p className="text-3xl font-bold">1</p>
              <p className="text-gray-600 text-lg">Resolved</p>
            </div>

            {/* Total Votes */}
           <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">

              <FaThumbsUp className="text-5xl text-blue-500 mb-3" />
              <p className="text-3xl font-bold">35</p>
              <p className="text-gray-600 text-lg">Total Votes</p>
            </div>

            {/* Role */}
           <div className="flex flex-col items-center justify-center bg-gray-100 h-45 p-4 rounded-2xl shadow-lg w-full sm:w-[45%] lg:w-[22%] transition-transform hover:scale-105">

              <FaUserShield className="text-5xl text-yellow-600 mb-3" />
              <p className="text-2xl font-bold">{user.role}</p>
              <p className="text-gray-600 text-lg">Role</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
<div className="w-full mt-6 mb-6">
  <div className="w-full h-12 bg-gray-200 p-1 rounded-xl shadow-sm">
    {/* Scrollable Tabs */}
    <div className="flex w-full overflow-x-auto h-full">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 text-center px-4 py-2 font-semibold text-base transition-all duration-200 whitespace-nowrap
            ${index !== tabs.length - 1 ? "border-r border-gray-300" : ""}
            ${
              activeTab === tab.id
                ? "bg-white text-[#14213D] rounded-md shadow-inner"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
</div>

        {/* Tab Content */}
        <div className="bg-gray-100 p-6 rounded-2xl shadow">
          {activeTab === "reports" && (
            <div>
              {/* Recent Activity */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">📈 Recent Activity</h2>
                <button className="bg-[#14213D] text-white px-4 py-1 rounded-lg shadow hover:bg-blue-900">
                  + see more
                </button>
              </div>
              <p className="text-gray-600 mb-6">Your latest reported issues</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="issue"
                    className="rounded-lg mb-3"
                  />
                  <p>
                    <strong>Issue:</strong> Pothole on Main St
                  </p>
                  <p>
                    <strong>Location:</strong> Mainstreet, CA
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-yellow-200 text-yellow-800">
                    ⏳ In Progress
                  </span>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="issue"
                    className="rounded-lg mb-3"
                  />
                  <p>
                    <strong>Issue:</strong> Broken StreetLight
                  </p>
                  <p>
                    <strong>Location:</strong> Mainstreet, CA
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-200 text-blue-800">
                    ✅ Resolved
                  </span>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="issue"
                    className="rounded-lg mb-3"
                  />
                  <p>
                    <strong>Issue:</strong> Drainage Recovery
                  </p>
                  <p>
                    <strong>Location:</strong> SantaCruz, CA
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700">
                    ⌛ Pending
                  </span>
                </div>
              </div>
            </div>
          )}
          {activeTab === "profile" && (
            <div className="mb-8">
              <div>
                <p className="text-2xl font-bold">Profile Information</p>
                <p>Manage your account settings</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-5 mb-6 gap-4">
                <div className="flex items-center gap-3">
                  {/* Profile circle */}
                  <div className="w-12 h-12 rounded-full bg-[#D9D9D9] text-black font-bold flex items-center justify-center text-sm uppercase cursor-pointer">
                    {initial}
                  </div>

                  {/* User details */}
                  <div>
                    <div className="font-semibold break-all">{user.email}</div>
                    <div className="text-gray-600 text-sm">{user.role}</div>
                  </div>
                </div>

                <button
                  className="bg-[#14213D] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 flex gap-2 items-center self-start sm:self-auto"
                  onClick={() => navigate("/profile")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
