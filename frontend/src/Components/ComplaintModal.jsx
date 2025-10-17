import React, { useEffect, useState } from "react";
// 1. Import FaSpinner icon
import { FaTimes, FaMapMarkerAlt, FaTag, FaExclamationTriangle, FaCalendarAlt, FaPaperPlane, FaThumbsUp, FaThumbsDown, FaReply, FaTrash, FaImage, FaSpinner } from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const ComplaintModal = ({ complaint, onClose, onCommentAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(complaint?.comments?.length || 0);
    const [newComment, setNewComment] = useState("");
    const [commentImage, setCommentImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [activeReplyId, setActiveReplyId] = useState(null);
    // 2. Add new state for loading animation
    const [isPostingComment, setIsPostingComment] = useState(false);


    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (complaint) {
            requestAnimationFrame(() => setIsOpen(true));
            setCommentCount(complaint.comments?.length || 0)
            fetchComments();
        } else {
            setIsOpen(false);
        }
    }, [complaint]);

    const fetchComments = async () => {
        if (!complaint) return;
        try {
            const res = await fetch(`http://localhost:3002/api/comments/${complaint._id}`, { credentials: 'include' });
            const data = await res.json();
            if (res.ok) {
                setComments(data.data);
                const totalComments = data.data.reduce((acc, comment) => acc + 1 + (comment.replies ? comment.replies.length : 0), 0);
                setCommentCount(totalComments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handlePostComment = async (e, text, parentId = null, imageFile = null) => {
        e.preventDefault();
        if (!text.trim()) return;

        // 3. Set loading to true before sending request
        setIsPostingComment(true);

        const formData = new FormData();
        formData.append("text", text);
        if (parentId) formData.append("parentCommentId", parentId);
        if (imageFile) formData.append("image", imageFile);

        try {
            const res = await fetch(`http://localhost:3002/api/comments/${complaint._id}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const newCommentData = await res.json();

            if (res.ok) {
                if (parentId) {
                    fetchComments();
                } else {
                    setComments(prevComments => [...prevComments, newCommentData.data]);
                    setCommentCount(prevCount => prevCount + 1);
                }

                if (onCommentAdded) {
                   onCommentAdded(complaint._id, newCommentData.data);
                }

                setNewComment("");
                setCommentImage(null);
                setPreviewImage(null);
                setActiveReplyId(null);
            } else {
                 throw new Error(newCommentData.message || "Failed to post comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert(`Error: ${error.message}`);
        } finally {
            // 4. Set loading back to false after request is complete
            setIsPostingComment(false);
        }
    };
    
    const handleLike = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:3002/api/comments/${commentId}/like`, { method: 'POST', credentials: 'include' });
            if (res.ok) fetchComments();
        } catch (error) { console.error("Error liking comment:", error); }
    };

    const handleDislike = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:3002/api/comments/${commentId}/dislike`, { method: 'POST', credentials: 'include' });
            if (res.ok) fetchComments();
        } catch (error) { console.error("Error disliking comment:", error); }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const res = await fetch(`http://localhost:3002/api/comments/${commentId}`, { method: 'DELETE', credentials: 'include' });
                if (res.ok) fetchComments();
            } catch (error) { console.error("Error deleting comment:", error); }
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCommentImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    if (!complaint) return null;

    const position = [complaint.location_coords.coordinates[1], complaint.location_coords.coordinates[0]];
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(24, 38, 53, 0.2)', backdropFilter: 'blur(8px)'}}
            onClick={onClose}
        >
            <div
                className={`bg-white w-full max-w-5xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate pr-4">{complaint.title}</h2>
                    <button onClick={onClose} className="flex-shrink-0 text-slate-400 rounded-full p-2 hover:bg-slate-100" aria-label="Close modal">
                        <FaTimes size={20} />
                    </button>
                </header>

                <main className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            {complaint.photo && <img src={complaint.photo} alt={complaint.title} className="w-full object-cover rounded-xl shadow-lg" />}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
                                <p className="text-slate-600 leading-relaxed bg-white p-4 rounded-lg border">{complaint.description}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
                                <InfoItem icon={<FaTag />} label="Type" value={complaint.type} />
                                <PriorityInfo priority={complaint.priority} />
                                <InfoItem icon={<FaCalendarAlt />} label="Reported On" value={formatDate(complaint.createdAt)} />
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Location</h3>
                                <div className="flex items-start text-slate-600 bg-white p-4 rounded-lg border">
                                    <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0 text-slate-400" />
                                    <span>{complaint.address}</span>
                                </div>
                            </div>
                            <div className="h-64 sm:h-80 lg:h-[calc(100%-4rem)] w-full rounded-xl overflow-hidden border-2 shadow-inner">
                                <MapContainer center={position} zoom={16} className="h-full w-full" scrollWheelZoom={false}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                                    <Marker position={position} icon={markerIcon} />
                                </MapContainer>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Comments ({commentCount})</h3>
                        <form onSubmit={(e) => handlePostComment(e, newComment, null, commentImage)} className="mb-6">
                            <div className="flex items-start gap-4">
                                <UserAvatar user={user} />
                                <div className="flex-1">
                                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a public comment..." className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 shadow-sm" rows="2" />
                                    {previewImage && <img src={previewImage} alt="preview" className="mt-2 rounded-lg max-h-24 border" />}
                                    <div className="flex justify-between items-center mt-2">
                                        <label htmlFor="comment-image-upload" className="cursor-pointer text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                                            <FaImage size={20} />
                                            <input type="file" id="comment-image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                        {/* 5. Update the button to show spinner when loading */}
                                        <button type="submit" className="flex items-center justify-center w-24 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed" disabled={isPostingComment}>
                                            {isPostingComment ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="mr-2"/> Post
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="space-y-5">
                            {comments.map(comment => (
                                <Comment key={comment._id} comment={comment} onLike={handleLike} onDislike={handleDislike} onDelete={handleDelete} onReplySubmit={handlePostComment} currentUser={user} activeReplyId={activeReplyId} setActiveReplyId={setActiveReplyId} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const Comment = ({ comment, onLike, onDislike, onDelete, onReplySubmit, currentUser, activeReplyId, setActiveReplyId }) => {
    const isReplying = activeReplyId === comment._id;
    const [replyText, setReplyText] = useState("");
    
    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + " years ago";
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " months ago";
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + " days ago";
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + " hours ago";
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + " minutes ago";
        return "Just now";
    };

    return (
        <div className="flex items-start gap-3">
            <UserAvatar user={comment.user} />
            <div className="flex-1">
                <div className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800 text-sm">{comment.user.name}</p>
                        <span className="text-xs text-gray-400">{timeSince(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 my-1 whitespace-pre-wrap">{comment.text}</p>
                    {comment.image && <img src={comment.image} alt="comment content" className="mt-2 rounded-lg max-h-52 border" />}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 px-1">
                    <button onClick={() => onLike(comment._id)} className={`flex items-center gap-1 font-semibold ${comment.likes.includes(currentUser.id) ? "text-blue-600" : "hover:text-blue-600"}`}>
                        <FaThumbsUp /> {comment.likes.length}
                    </button>
                    <button onClick={() => onDislike(comment._id)} className={`flex items-center gap-1 font-semibold ${comment.dislikes.includes(currentUser.id) ? "text-gray-800" : "hover:text-gray-800"}`}>
                        <FaThumbsDown /> {comment.dislikes.length}
                    </button>
                    <button onClick={() => setActiveReplyId(isReplying ? null : comment._id)} className="flex items-center gap-1 font-semibold hover:text-gray-800">
                        <FaReply /> Reply
                    </button>
                    {currentUser.id === comment.user._id &&
                        <button onClick={() => onDelete(comment._id)} className="flex items-center gap-1 text-red-500 font-semibold hover:text-red-700">
                            <FaTrash /> Delete
                        </button>
                    }
                </div>
                {isReplying && (
                    <form onSubmit={(e) => onReplySubmit(e, replyText, comment._id)} className="mt-2 ml-4 flex items-start gap-3">
                        <UserAvatar user={currentUser} />
                        <div className="flex-1">
                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={`Replying to ${comment.user.name}...`} className="w-full border rounded-lg p-2 text-sm" rows="1" />
                            <div className="text-right mt-1 space-x-2">
                                <button type="button" onClick={() => setActiveReplyId(null)} className="text-xs text-gray-600 font-semibold px-3 py-1 rounded-md">Cancel</button>
                                <button type="submit" className="text-xs bg-blue-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-blue-600">Reply</button>
                            </div>
                        </div>
                    </form>
                )}
                <div className="mt-3 ml-6 pl-4 border-l-2 space-y-3">
                    {comment.replies && comment.replies.map(reply => (
                        <Comment key={reply._id} comment={reply} onLike={onLike} onDislike={onDislike} onDelete={onDelete} onReplySubmit={onReplySubmit} currentUser={currentUser} activeReplyId={activeReplyId} setActiveReplyId={setActiveReplyId} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper Components
const UserAvatar = ({ user }) => (<img src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=random&color=fff`} alt={user?.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />);
const InfoItem = ({ icon, label, value, valueClassName = "text-slate-700" }) => (<div className="flex items-start gap-3"><div className="mt-1 text-slate-400">{icon}</div><div><p className="text-xs font-bold uppercase tracking-wider">{label}</p><p className={`text-base font-semibold ${valueClassName}`}>{value}</p></div></div>);
const PriorityInfo = ({ priority }) => { const styles = { High: "text-red-600", Medium: "text-amber-600", Low: "text-green-600" }; return <InfoItem icon={<FaExclamationTriangle />} label="Priority" value={priority} valueClassName={styles[priority] || 'text-slate-700'} />;};

export default ComplaintModal;