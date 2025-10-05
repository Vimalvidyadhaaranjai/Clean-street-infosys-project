import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
// Import icons from react-icons, including the new eye icons
import { FiUser, FiMail, FiMapPin, FiLock, FiCamera, FiEdit3, FiSave, FiShield, FiX, FiEye, FiEyeOff } from "react-icons/fi";

export default function Profilepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  
  // NEW: State to manage password visibility for each field
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // State to manage the active tab ('personal' or 'security')
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name || "", email: parsed.email || "", location: parsed.location || "" });
        setPreviewUrl(parsed.profilePhoto || "");
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);



  const getInitials = (name) => (name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U");
  const handleChange = (e) => setForm((prev) => ({ ...prev, [name]: e.target.value }));
 const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
 }
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const res = await fetch("http://localhost:3002/api/user/profile/photo", { 
        method: "POST", 
        credentials: "include", 
        body: formData 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload photo");
      
      // Use the returned user object
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setPreviewUrl(data.user.profilePhoto);
      setSelectedFile(null);
      alert("Profile photo updated");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3002/api/user/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || "", email: user?.email || "", location: user?.location || "" });
    setIsEditing(false);
    setError("");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return setPasswordError("New passwords don't match");
    if (passwordForm.newPassword.length < 6) return setPasswordError("Password must be at least 6 characters long");
    setIsSubmittingPassword(true);
    try {
      const res = await fetch(
        "http://localhost:3002/api/user/profile/password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      // Reset form and show success
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      alert("Password updated successfully");
    } catch (e) {
      setPasswordError(e.message);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-10">
        <button
          className="flex gap-1 text-gray-500 text-sm"
           onClick={() => navigate("/UserDashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            class="size-6"
            className="size-6 -translate-y-0.5"
            
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h15"
            />
 
          </svg>
         Back to dashboard
        </button>
        <div className="flex items-start justify-between gap-4 mt-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">Profile</h1>
            <p className="text-gray-600 mb-4 text-base sm:text-lg">
              Your account information
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                className="px-4 py-2 rounded-md bg-[#0a2463] text-white hover:bg-[#081b4a]"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-[#0a2463] text-white hover:bg-[#081b4a] disabled:opacity-60"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Avatar and summary */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover mb-6"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 mb-6">
                {getInitials(user.name)}
              </div>
            )}
            <div className="w-full flex flex-col items-center gap-4 mt-2">
              <label className="text-lg font-medium text-gray-700">
                Upload profile photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-photo-input"
              />
              <label
                htmlFor="profile-photo-input"
                className="inline-flex items-center px-6 py-2.5 bg-blue-50 text-blue-700 font-medium text-sm rounded-full hover:bg-blue-100 cursor-pointer transition-colors duration-200"
              >
                Choose File
              </label>
              <span className="text-gray-500 text-sm mt-2">
                {selectedFile?.name || "No file chosen"}
              </span>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              )}
              <button
                className="px-6 py-2.5 rounded-full bg-[#0a2463] text-white hover:bg-[#081b4a] disabled:opacity-60 font-medium text-sm transition-colors duration-200 mt-4"
                onClick={handleUploadPhoto}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Accepted: images (JPG, PNG). Max ~5MB.
              </p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2">
            {/* Account Details Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? form.name : user.name}
                    onChange={isEditing ? handleChange : undefined}
                    readOnly={!isEditing}
                    className={`w-full p-3 border rounded-md ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? form.email : user.email}
                    onChange={isEditing ? handleChange : undefined}
                    readOnly={!isEditing}
                    className={`w-full p-3 border rounded-md ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user.role || "user"}
                    readOnly
                    className="w-full p-3 border rounded-md bg-gray-100 capitalize"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={isEditing ? form.location : user.location || ""}
                    onChange={isEditing ? handleChange : undefined}
                    readOnly={!isEditing}
                    className={`w-full p-3 border rounded-md ${
                      isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </div>
              </div>
              <div className="p-6">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {activeTab === "personal" && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          oldPassword: e.target.value,
                        }))
                      }
                      className="w-full p-3 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full p-3 border rounded-md"
                      required
                      minLength={6}
                    />
                  </div>
                )}
                {activeTab === "security" && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full p-3 border rounded-md"
                      required
                      minLength={6}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// UPDATED: InputField component now handles password visibility toggling
const InputField = ({ label, icon, name, value, onChange, isEditing, type = "text", readOnly = false, isVisible, onToggleVisibility }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
      <input
        type={type === 'password' && isVisible ? 'text' : type}
        id={name}
        name={name}
        value={value || ""}
        onChange={isEditing ? onChange : undefined}
        readOnly={!isEditing || readOnly}
        className={`w-full pl-10 pr-10 p-3 border rounded-md transition-colors ${isEditing && !readOnly ? "bg-white border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" : "bg-gray-100 border-gray-200 cursor-not-allowed"}`}
        required={isEditing && name.includes('Password')}
      />
      {type === 'password' && (
        <button type="button" onClick={onToggleVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
          {isVisible ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </div>
  </div>
);