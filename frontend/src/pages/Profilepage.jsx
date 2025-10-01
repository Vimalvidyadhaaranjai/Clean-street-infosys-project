import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({
          name: parsed.name || "",
          email: parsed.email || "",
          location: parsed.location || "",
        });
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
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
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload photo");

      const updated = { ...user, profilePhoto: data.profilePhoto };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setSelectedFile(null);
      setPreviewUrl("");
      alert("Profile photo updated");
    } catch (e) {
      setError(e.message);
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3002/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      // Update local user and storage
      const updated = {
        ...user,
        name: data.name,
        email: data.email,
        location: data.location,
        role: data.role,
        profilePhoto: data.profilePhoto,
      };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (e) {
      setError(e.message);
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // reset form to current user values
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      location: user?.location || "",
    });
    setIsEditing(false);
    setError("");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">Profile</h1>
            <p className="text-gray-600 mb-4 text-base sm:text-lg">Your account information</p>
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
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

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
              <label className="text-lg font-medium text-gray-700">Upload profile photo</label>
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
              <span className="text-gray-500 text-sm mt-2">{selectedFile?.name || 'No file chosen'}</span>
              {previewUrl && (
                <img src={previewUrl} alt="preview" className="w-24 h-24 rounded-lg object-cover border" />
              )}
              <button
                className="px-6 py-2.5 rounded-full bg-[#0a2463] text-white hover:bg-[#081b4a] disabled:opacity-60 font-medium text-sm transition-colors duration-200 mt-4"
                onClick={handleUploadPhoto}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
              <p className="text-sm text-gray-500 mt-3">Accepted: images (JPG, PNG). Max ~5MB.</p>
            </div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="mt-3 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
              {user.role || "user"}
            </span>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? form.name : user.name}
                  onChange={isEditing ? handleChange : undefined}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md ${isEditing ? "bg-white" : "bg-gray-100"}`}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={isEditing ? form.email : user.email}
                  onChange={isEditing ? handleChange : undefined}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md ${isEditing ? "bg-white" : "bg-gray-100"}`}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <input
                  type="text"
                  value={user.role || "user"}
                  readOnly
                  className="w-full p-3 border rounded-md bg-gray-100 capitalize"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={isEditing ? form.location : user.location || ""}
                  onChange={isEditing ? handleChange : undefined}
                  readOnly={!isEditing}
                  className={`w-full p-3 border rounded-md ${isEditing ? "bg-white" : "bg-gray-100"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
