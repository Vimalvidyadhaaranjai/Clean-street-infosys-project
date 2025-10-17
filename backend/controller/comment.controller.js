import Comment from '../models/comment.model.js';
import Complaint from '../models/complaint.model.js';

// Get all comments for a specific complaint
export const getCommentsForComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const comments = await Comment.find({ complaint: complaintId, parentComment: null })
      .populate('user', 'name profilePhoto')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name profilePhoto' }
      })
      .sort({ createdAt: -1 }); // Show newest comments first

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new comment or a reply
export const addComment = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text, parentCommentId } = req.body;
    const userId = req.user._id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const newComment = new Comment({
      complaint: complaintId,
      user: userId,
      text,
      parentComment: parentCommentId || null,
    });

   if (req.file) {
    // Use the path directly from Cloudinary
    newComment.image = req.file.path;
}

    let savedComment = await newComment.save();
    
    // Populate user info before sending back to client
    savedComment = await savedComment.populate('user', 'name profilePhoto');

    if (parentCommentId) {
      // This is a reply, add it to parent comment's replies array
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        parentComment.replies.push(savedComment._id);
        await parentComment.save();
      }
    } else {
      // This is a top-level comment, add it to the complaint's comments array
      complaint.comments.push(savedComment._id);
      await complaint.save();
    }

    res.status(201).json({ success: true, data: savedComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    // Remove from dislikes if present
    comment.dislikes.pull(userId);
    
    // Toggle like
    const likesIndex = comment.likes.indexOf(userId);
    if (likesIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likesIndex, 1);
    }

    await comment.save();
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Remove from likes if present
    comment.likes.pull(userId);

    // Toggle dislike
    const dislikesIndex = comment.dislikes.indexOf(userId);
    if (dislikesIndex === -1) {
        comment.dislikes.push(userId);
    } else {
        comment.dislikes.splice(dislikesIndex, 1);
    }

    await comment.save();
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment." });
        }

        // Also remove from parent complaint or parent comment
        if (comment.parentComment) {
            await Comment.updateOne({ _id: comment.parentComment }, { $pull: { replies: commentId } });
        } else {
            await Complaint.updateOne({ _id: comment.complaint }, { $pull: { comments: commentId } });
        }
        
        // Delete all replies to this comment
        if (comment.replies && comment.replies.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }
        
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ success: true, message: "Comment deleted successfully." });

    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}