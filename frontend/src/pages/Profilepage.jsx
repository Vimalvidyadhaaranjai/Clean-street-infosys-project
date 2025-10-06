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
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
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

  // NEW: Function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getInitials = (name) => (name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U");
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleChangeLocation = (e) => setForm((prev) => ({ ...prev, location: e.target.value }));
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
      const res = await fetch("http://localhost:3002/api/user/profile/password", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        credentials: "include", 
        body: JSON.stringify({ // <-- Add JSON.stringify here
          oldPassword: passwordForm.oldPassword, 
          newPassword: passwordForm.newPassword 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
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
      <main className="flex-1 container mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your personal and security details.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md text-center flex flex-col items-center">
              <div className="relative mb-4">
                {previewUrl ? <img src={previewUrl} alt="avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm" /> : <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">{getInitials(user.name)}</div>}
                <label htmlFor="profile-photo-input" className="absolute -bottom-2 -right-2 bg-[#0a2463] text-white p-2.5 rounded-full cursor-pointer hover:bg-[#081b4a] transition-colors">
                  <FiCamera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-photo-input" />
                </label>
              </div>
              {selectedFile && <button onClick={handleUploadPhoto} disabled={uploading} className="mb-4 text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50">{uploading ? "Uploading..." : `Upload ${selectedFile.name}`}</button>}
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <span className="mt-3 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full capitalize">{user.role || "user"}</span>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-2 px-6">
                  <button onClick={() => setActiveTab("personal")} className={`flex items-center gap-2 py-4 px-1 font-medium ${activeTab === "personal" ? "border-b-2 border-[#0a2463] text-[#0a2463]" : "text-gray-500 hover:text-gray-700"}`}><FiUser /> Personal Details</button>
                  <button onClick={() => setActiveTab("security")} className={`flex items-center gap-2 py-4 px-1 font-medium ${activeTab === "security" ? "border-b-2 border-[#0a2463] text-[#0a2463]" : "text-gray-500 hover:text-gray-700"}`}><FiShield /> Security</button>
                </nav>
              </div>
              <div className="p-6">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {activeTab === "personal" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Your Information</h3>
                      {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#0a2463] text-white hover:bg-[#081b4a] transition-colors"><FiEdit3 /> Edit</button> : <div className="flex items-center gap-2"><button onClick={handleCancel} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"><FiX /> Cancel</button><button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition-colors"><FiSave /> {saving ? "Saving..." : "Save"}</button></div>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Full Name" icon={<FiUser />} name="name" value={form.name} onChange={handleChange} isEditing={isEditing} />
                      <InputField label="Email Address" icon={<FiMail />} name="email" value={form.email} onChange={handleChange} isEditing={isEditing} type="email" />
                      <InputField label="Location" icon={<FiMapPin />} name="location" value={form.location} onChange={handleChangeLocation} isEditing={isEditing} />
                      <InputField label="Role" icon={<FiUser />} name="role" value={user.role || 'user'} isEditing={false} readOnly />
                    </div>
                  </div>
                )}
                {activeTab === "security" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h3>
                    {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {/* UPDATED: Pass visibility state and toggle function to password fields */}
                      <InputField label="Current Password" icon={<FiLock />} name="oldPassword" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))} type="password" required isEditing isVisible={passwordVisibility.current} onToggleVisibility={() => togglePasswordVisibility('current')} />
                      <InputField label="New Password" icon={<FiLock />} name="newPassword" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} type="password" required isEditing isVisible={passwordVisibility.new} onToggleVisibility={() => togglePasswordVisibility('new')} />
                      <InputField label="Confirm New Password" icon={<FiLock />} name="confirmPassword" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} type="password" required isEditing isVisible={passwordVisibility.confirm} onToggleVisibility={() => togglePasswordVisibility('confirm')} />
                      <div className="flex justify-end pt-2">
                        <button type="submit" disabled={isSubmittingPassword} className="px-5 py-2.5 rounded-md bg-[#0a2463] text-white font-semibold hover:bg-[#081b4a] disabled:opacity-60 transition-colors">{isSubmittingPassword ? "Updating..." : "Update Password"}</button>
                      </div>
                    </form>
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