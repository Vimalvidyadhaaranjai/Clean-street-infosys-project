// src/Components/ComplaintModal.jsx - MODIFIED WITH LOGIN CHECK FOR COMMENT FORM

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // <-- ADDED: For login/signup links
import { FiX, FiMapPin, FiTag, FiAlertTriangle, FiCalendar, FiSend, FiThumbsUp, FiThumbsDown, FiMessageSquare, FiTrash2, FiImage, FiLoader } from "react-icons/fi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const ComplaintModal = ({ complaint, onClose, onCommentAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(complaint?.comments?.length || 0);
    const [newComment, setNewComment] = useState("");
    const [commentImage, setCommentImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [isPostingComment, setIsPostingComment] = useState(false);
    const modalContentRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);

     useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (e) { console.error("Error parsing user from localStorage:", e); }
    }, []);

    useEffect(() => {
        if (complaint) {
            setTimeout(() => setIsOpen(true), 10);
            setCommentCount(complaint.comments?.length || 0)
            fetchComments();
            setNewComment("");
            setCommentImage(null);
            setPreviewImage(null);
            setActiveReplyId(null);
            setIsPostingComment(false);
        } else {
            setIsOpen(false);
        }
    }, [complaint]);

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);


    const fetchComments = async () => {
        if (!complaint) return;
        try {
            const res = await fetch(`${backendUrl}/api/comments/${complaint._id}`, { credentials: 'include' });
            const data = await res.json();
            if (res.ok) {
                setComments(data.data);
                const totalComments = data.data.reduce((acc, comment) => acc + 1 + (comment.replies ? comment.replies.length : 0), 0);
                setCommentCount(totalComments);
            }
        } catch (error) { console.error("Error fetching comments:", error); }
    };

    const handlePostComment = async (e, text, parentId = null, imageFile = null) => {
        e.preventDefault();
        if (!text?.trim()) return;
        setIsPostingComment(true);
        const formData = new FormData();
        formData.append("text", text);
        if (parentId) formData.append("parentCommentId", parentId);
        if (imageFile) formData.append("image", imageFile);
        try {
            const res = await fetch(`${backendUrl}/api/comments/${complaint._id}`, { method: 'POST', credentials: 'include', body: formData });
            const newCommentData = await res.json();
            if (res.ok) {
                fetchComments(); 
                if (onCommentAdded) { onCommentAdded(complaint._id, newCommentData.data); }
                setNewComment("");
                setCommentImage(null);
                setPreviewImage(null);
                setActiveReplyId(null);
            } else { throw new Error(newCommentData.message || "Failed to post comment"); }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsPostingComment(false);
        }
    };

    const handleLike = async (commentId) => {
        if (!currentUser) return toast.error("Please login to vote."); // ADDED check
         try {
            const res = await fetch(`${backendUrl}/api/comments/${commentId}/like`, { method: 'POST', credentials: 'include' });
            if (res.ok) fetchComments();
        } catch (error) { console.error("Error liking comment:", error); }
    };
    const handleDislike = async (commentId) => {
        if (!currentUser) return toast.error("Please login to vote."); // ADDED check
        try {
            const res = await fetch(`${backendUrl}/api/comments/${commentId}/dislike`, { method: 'POST', credentials: 'include' });
            if (res.ok) fetchComments();
        } catch (error) { console.error("Error disliking comment:", error); }
    };
    const handleDelete = async (commentId) => {
        if (!currentUser) return toast.error("Please login to delete comments."); // ADDED check
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const res = await fetch(`${backendUrl}/api/comments/${commentId}`, { method: 'DELETE', credentials: 'include' });
                if (res.ok) fetchComments();
            } catch (error) { console.error("Error deleting comment:", error); }
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
             const file = e.target.files[0];
            setCommentImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    if (!complaint) return null;

    const position = [complaint.location_coords.coordinates[1], complaint.location_coords.coordinates[0]];
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });


    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(0, 8, 20, 0.7)', backdropFilter: 'blur(8px)'}}
        >
            <div
                ref={modalContentRef}
                className={`bg-[var(--color-medium-bg)] w-full max-w-5xl max-h-[90vh] flex flex-col rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform border border-[var(--color-light-bg)] ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
            >
                <header className="flex-shrink-0 flex items-center justify-between p-5 bg-[var(--color-dark-bg)] border-b border-[var(--color-light-bg)]">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-secondary-accent)] truncate pr-4">{complaint.title}</h2>
                    <button onClick={onClose} className="flex-shrink-0 text-gray-400 rounded-full p-1.5 hover:bg-[var(--color-light-bg)] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-1 focus:ring-offset-[var(--color-dark-bg)]" aria-label="Close modal">
                        <FiX size={20} />
                    </button>
                </header>

                <main className="flex-grow p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-[var(--color-dark-bg)]">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                         {/* Left Column */}
                        <div className="space-y-6">
                            {complaint.photo && (
                                <div className="rounded-lg overflow-hidden shadow-md border border-[var(--color-light-bg)]">
                                    <img src={complaint.photo} alt={complaint.title} className="w-full h-auto max-h-[400px] object-contain bg-black/50" />
                                </div>
                            )}
                            <div className="bg-[var(--color-medium-bg)] p-5 rounded-lg border border-[var(--color-light-bg)] shadow-sm">
                                <h3 className="text-lg font-semibold text-[var(--color-primary-accent)] mb-3">Details</h3>
                                <div className="space-y-3">
                                    <InfoItem icon={<FiTag />} label="Type" value={complaint.type} />
                                    <PriorityInfo priority={complaint.priority} />
                                    <InfoItem icon={<FiCalendar />} label="Reported On" value={formatDate(complaint.createdAt)} />
                                    <InfoItem icon={<FiMapPin />} label="Address" value={complaint.address} />
                                    {complaint.landmark && <InfoItem icon={<FiMapPin />} label="Landmark" value={complaint.landmark} />}
                                </div>
                            </div>
                             <div className="bg-[var(--color-medium-bg)] p-5 rounded-lg border border-[var(--color-light-bg)] shadow-sm">
                                <h3 className="text-lg font-semibold text-[var(--color-primary-accent)] mb-3">Description</h3>
                                <p className="text-[var(--color-text-light)]/90 leading-relaxed text-sm whitespace-pre-wrap">{complaint.description}</p>
                            </div>
                        </div>

                         {/* Right Column */}
                        <div className="space-y-6 flex flex-col">
                            <div className="bg-[var(--color-medium-bg)] p-5 rounded-lg border border-[var(--color-light-bg)] shadow-sm">
                                <h3 className="text-lg font-semibold text-[var(--color-primary-accent)] mb-3">Location</h3>
                                <div className="h-64 sm:h-72 w-full rounded-md overflow-hidden border border-[var(--color-light-bg)] shadow-inner">
                                    <MapContainer center={position} zoom={16} className="h-full w-full" scrollWheelZoom={true}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                                        <Marker position={position} icon={markerIcon} />
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="bg-[var(--color-medium-bg)] p-5 rounded-lg border border-[var(--color-light-bg)] shadow-sm flex-grow flex flex-col">
                                <h3 className="text-lg font-semibold text-[var(--color-primary-accent)] mb-4 flex-shrink-0">Discussion ({commentCount})</h3>

                                <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2 mb-4 max-h-[400px]">
                                    {comments.length > 0 ? comments.map(comment => (
                                        <Comment
                                            key={comment._id}
                                            comment={comment}
                                            onLike={handleLike}
                                            onDislike={handleDislike}
                                            onDelete={handleDelete}
                                            onReplySubmit={handlePostComment}
                                            currentUser={currentUser}
                                            activeReplyId={activeReplyId}
                                            setActiveReplyId={setActiveReplyId}
                                        />
                                    )) : (
                                        <p className="text-sm text-[var(--color-text-light)]/60 text-center py-4">No comments yet.</p>
                                    )}
                                </div>

                                 {/* --- MODIFIED: Conditional Comment Form --- */}
                                <div className="mt-auto flex-shrink-0 pt-4 border-t border-[var(--color-light-bg)]">
                                    {currentUser ? (
                                        // User is LOGGED IN: Show comment form
                                        <form onSubmit={(e) => handlePostComment(e, newComment, null, commentImage)} className="">
                                            <div className="flex items-start gap-3">
                                                <UserAvatar user={currentUser} size="sm" />
                                                <div className="flex-1">
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Add your comment..."
                                                        className="w-full border border-[var(--color-light-bg)] rounded-md p-2.5 text-sm focus:ring-1 focus:ring-[var(--color-primary-accent)] focus:border-[var(--color-primary-accent)] transition shadow-sm resize-none bg-[var(--color-dark-bg)] text-[var(--color-text-light)] placeholder:text-[var(--color-text-light)]/50"
                                                        rows="2" />
                                                    <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <label htmlFor="comment-image-upload" className="cursor-pointer text-[var(--color-text-light)]/70 hover:text-[var(--color-primary-accent)] p-1.5 rounded-full hover:bg-[var(--color-light-bg)]/50 transition-colors" title="Attach image">
                                                                <FiImage size={18} />
                                                                <input type="file" id="comment-image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                            </label>
                                                            {previewImage && (
                                                                <div className="relative group">
                                                                    <img src={previewImage} alt="preview" className="rounded max-h-14 border border-[var(--color-light-bg)]" />
                                                                    <button type="button" onClick={() => {setPreviewImage(null); setCommentImage(null);}} className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image">
                                                                        <FiX size={10}/>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="flex items-center justify-center gap-1.5 w-24 bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] font-semibold px-3 py-1.5 text-sm rounded-md shadow-sm hover:bg-[var(--color-secondary-accent)] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                                                            disabled={isPostingComment || !newComment.trim()}
                                                        >
                                                            {isPostingComment ? <FiLoader className="animate-spin" size={16}/> : <> <FiSend size={14}/> Post </>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        // User is LOGGED OUT: Show login message
                                        <div className="text-center py-4">
                                            <FiMessageSquare className="mx-auto text-4xl text-[var(--color-light-bg)] mb-3" />
                                            <h4 className="font-semibold text-[var(--color-secondary-accent)]">Join the Discussion</h4>
                                            <p className="text-sm text-[var(--color-text-light)]/70 mt-1">
                                                <Link to="/login" className="font-medium text-[var(--color-primary-accent)] hover:underline">Log in</Link> or 
                                                <Link to="/register" className="font-medium text-[var(--color-primary-accent)] hover:underline"> sign up</Link> to add comments and vote.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* --- END MODIFICATION --- */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Comment Component
const Comment = ({ comment, onLike, onDislike, onDelete, onReplySubmit, currentUser, activeReplyId, setActiveReplyId }) => {
    const isReplying = activeReplyId === comment._id;
    const [replyText, setReplyText] = useState("");
    const [isPostingReply, setIsPostingReply] = useState(false);

    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000); if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");
        interval = Math.floor(seconds / 2592000); if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");
        interval = Math.floor(seconds / 86400); if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
        interval = Math.floor(seconds / 3600); if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
        interval = Math.floor(seconds / 60); if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");
        return Math.max(0, Math.floor(seconds)) + " seconds ago";
     };

    const submitReply = async (e) => {
        e.preventDefault();
        setIsPostingReply(true);
        await onReplySubmit(e, replyText, comment._id);
        setIsPostingReply(false);
    };

    const hasLiked = comment.likes?.includes(currentUser?.id);
    const hasDisliked = comment.dislikes?.includes(currentUser?.id);

    return (
        <div className="flex items-start gap-3 group">
            <UserAvatar user={comment.user} size="sm" />
            <div className="flex-1">
                <div className="bg-[var(--color-dark-bg)] p-3 rounded-lg border border-[var(--color-light-bg)]/80 mb-1 relative">
                     {currentUser?.id === comment.user?._id && (
                        <button
                            onClick={() => onDelete(comment._id)}
                            className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                            title="Delete Comment"
                        >
                            <FiTrash2 size={13} />
                        </button>
                    )}
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-[var(--color-text-light)] text-sm">{comment.user?.name || 'User'}</p>
                        <span className="text-xs text-[var(--color-text-light)]/50">{timeSince(comment.createdAt)}</span>
                    </div>
                    <p className="text-[var(--color-text-light)]/90 my-1 text-sm whitespace-pre-wrap">{comment.text}</p>
                    {comment.image && <img src={comment.image} alt="comment content" className="mt-2 rounded-md max-h-48 border border-[var(--color-light-bg)]" />}
                </div>
                {/* Action Buttons */}
                {/* MODIFIED: Don't show buttons if logged out */}
                {currentUser && (
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-light)]/60 mt-1 px-1">
                        <button onClick={() => onLike(comment._id)} className={`flex items-center gap-1 font-medium transition-colors ${hasLiked ? "text-[var(--color-primary-accent)]" : "hover:text-[var(--color-primary-accent)]"}`}>
                            <FiThumbsUp size={14} /> {comment.likes?.length || 0}
                        </button>
                        <button onClick={() => onDislike(comment._id)} className={`flex items-center gap-1 font-medium transition-colors ${hasDisliked ? "text-gray-400" : "hover:text-gray-400"}`}>
                            <FiThumbsDown size={14} /> {comment.dislikes?.length || 0}
                        </button>
                        <button onClick={() => setActiveReplyId(isReplying ? null : comment._id)} className="flex items-center gap-1 font-medium hover:text-[var(--color-text-light)] transition-colors">
                            <FiMessageSquare size={14} /> Reply
                        </button>
                    </div>
                )}
                
                {isReplying && currentUser && ( // <-- Also hide reply box if logged out
                    <form onSubmit={submitReply} className="mt-3 ml-4 pl-3 border-l-2 border-[var(--color-light-bg)]/70 flex items-start gap-3">
                        <UserAvatar user={currentUser} size="sm" />
                        <div className="flex-1">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Replying to ${comment.user?.name}...`}
                                className="w-full border border-[var(--color-light-bg)] rounded-md p-2 text-xs focus:ring-1 focus:ring-[var(--color-primary-accent)] focus:border-[var(--color-primary-accent)] transition shadow-sm resize-none bg-[var(--color-dark-bg)] text-[var(--color-text-light)] placeholder:text-[var(--color-text-light)]/50"
                                rows="2" />
                            <div className="flex justify-end items-center mt-1.5 space-x-2">
                                <button type="button" onClick={() => setActiveReplyId(null)} className="text-xs text-[var(--color-text-light)]/70 font-medium px-3 py-1 rounded-md hover:bg-[var(--color-light-bg)]/50 transition-colors">Cancel</button>
                                <button type="submit" className="text-xs bg-[var(--color-primary-accent)] text-[var(--color-text-dark)] font-semibold px-4 py-1 rounded-md hover:bg-[var(--color-secondary-accent)] transition-colors disabled:opacity-60" disabled={!replyText.trim() || isPostingReply}>
                                    {isPostingReply ? 'Replying...' : 'Reply'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                
                <div className="mt-4 ml-6 pl-4 border-l-2 border-[var(--color-light-bg)]/70 space-y-4">
                    {comment.replies && comment.replies.map(reply => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            onLike={onLike}
                            onDislike={onDislike}
                            onDelete={onDelete}
                            onReplySubmit={onReplySubmit}
                            currentUser={currentUser}
                            activeReplyId={activeReplyId}
                            setActiveReplyId={setActiveReplyId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}


// --- Helper Components ---
const UserAvatar = ({ user, size = 'md' }) => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
    const apiSize = size === 'sm' ? '32' : '40';
    const userName = user?.name || 'A';
    const userPhoto = user?.profilePhoto;

    return (<img src={userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=003566&color=ffd60a&size=${apiSize}`} alt={userName} className={`${sizeClasses} rounded-full object-cover flex-shrink-0 border border-[var(--color-light-bg)]`} />);
};

const InfoItem = ({ icon, label, value, valueClassName = "text-[var(--color-text-light)]/90" }) => (
    <div className="flex items-center gap-2">
        <div className="text-[var(--color-text-light)]/50 flex-shrink-0">{React.cloneElement(icon, { size: 16 })}</div>
        <div>
            <p className="text-xs font-medium text-[var(--color-text-light)]/70">{label}</p>
            <p className={`text-sm font-medium ${valueClassName}`}>{value}</p>
        </div>
    </div>
);

const PriorityInfo = ({ priority }) => {
    const styles = { High: "text-red-400", Medium: "text-orange-400", Low: "text-green-400" };
    return <InfoItem icon={<FiAlertTriangle />} label="Priority" value={priority} valueClassName={`${styles[priority] || 'text-[var(--color-text-light)]/90'} font-semibold`} />;
};

export default ComplaintModal;