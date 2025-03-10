// src/app/actions/posts.ts

"use server";

import { prisma } from "@/lib/prisma";

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post
export const createPost = async (userId: string, imageUrl: string, caption?: string) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
};

// Fetch a single post by ID
export const fetchPostById = async (postId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Could not fetch post');
  }
};

// Delete a post
export const deletePost = async (postId: string, userId: string) => {
  try {
    // First verify that the post belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.userId !== userId) {
      throw new Error('Not authorized to delete this post');
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Could not delete post');
  }
};

// Like a post
export const likePost = async (postId: string, userId: string) => {
  try {
    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    return like;
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Could not like post");
  }
};

// Unlike a post
export const unlikePost = async (postId: string, userId: string) => {
  try {
    // First check if the like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return { success: true }; // Like doesn't exist, so we can consider it "unliked"
    }

    // Delete the like if it exists
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error unliking post:", error);
    throw new Error("Could not unlike post");
  }
};

// Get likes for a post
export const getPostLikes = async (postId: string) => {
  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    return likes;
  } catch (error) {
    console.error("Error fetching post likes:", error);
    throw new Error("Could not fetch post likes");
  }
};

// Add a comment to a post
export const addComment = async (postId: string, userId: string, content: string) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not add comment");
  }
};

// Get comments for a post
export const getPostComments = async (postId: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  } catch (error) {
    console.error("Error fetching post comments:", error);
    throw new Error("Could not fetch post comments");
  }
};

// Delete a comment
export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Could not delete comment");
  }
};