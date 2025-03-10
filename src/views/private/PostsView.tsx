"use client";

// React imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// next-themes import
import { useTheme } from "next-themes";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CommentIcon from "@mui/icons-material/Comment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import DeleteIcon from "@mui/icons-material/Delete";

// Server action imports
import { 
  fetchPosts, 
  likePost, 
  unlikePost, 
  getPostLikes,
  addComment,
  getPostComments,
  deleteComment
} from "@/app/actions/posts";

// Interfaces
interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    profile?: {
      avatarUrl?: string | null;
    } | null;
  };
}

interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  user: {
    name: string | null;
    profile?: {
      avatarUrl?: string | null;
    } | null;
  };
}

interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    profile?: {
      avatarUrl?: string | null;
    } | null;
  };
}

const PostsView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: Like[] }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPosts: Post[] = await fetchPosts();
        setPosts(fetchedPosts);
        
        // Load likes for each post
        for (const post of fetchedPosts) {
          try {
            const fetchedLikes = await getPostLikes(post.id);
            setLikes(prev => ({ ...prev, [post.id]: fetchedLikes }));
          } catch (error) {
            console.error(`Failed to fetch likes for post ${post.id}:`, error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError("Nepodarilo sa načítať príspevky. Skúste to prosím znova.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Navigation handlers
  const handlePostClick = (postId: string) => {
    setTimeout(() => {
      router.push(`/prispevok/${postId}`);
    }, 1000);
  };

  const handleProfileClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userId === session?.user?.id) {
      router.push('/profil');
    } else {
      router.push(`/profil/${userId}`);
    }
  };

  // Like handlers
  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user?.id) return;

    try {
      const isLiked = likes[postId]?.some(like => like.userId === session.user.id);
      if (isLiked) {
        await unlikePost(postId, session.user.id);
        setLikes(prev => ({
          ...prev,
          [postId]: prev[postId].filter(like => like.userId !== session.user.id)
        }));
      } else {
        const newLike = await likePost(postId, session.user.id);
        setLikes(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newLike]
        }));
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  // Comment handlers
  const handleCommentClick = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(post);
    setCommentDialogOpen(true);
    
    try {
      const fetchedComments = await getPostComments(post.id);
      setComments(prev => ({ ...prev, [post.id]: fetchedComments }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedPost || !session?.user?.id || !newComment.trim()) return;

    try {
      const comment = await addComment(selectedPost.id, session.user.id, newComment.trim());
      setComments(prev => ({
        ...prev,
        [selectedPost.id]: [...(prev[selectedPost.id] || []), comment]
      }));
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost || !session?.user?.id) return;

    try {
      await deleteComment(commentId, session.user.id);
      setComments(prev => ({
        ...prev,
        [selectedPost.id]: prev[selectedPost.id].filter(comment => comment.id !== commentId)
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Determine card background based on theme
  const cardBackground =
    theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgb(225, 225, 225)";

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, color: theme === "dark" ? "#dddddd" : "#000000" }}
      >
        Príspevky
      </Typography>
      <Grid container spacing={2} direction="column">
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card
              sx={{
                width: "100%",
                backgroundColor: cardBackground,
                display: "flex",
                flexDirection: "column",
                borderRadius: "25px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => handlePostClick(post.id)}
            >
              {/* User's name with profile picture */}
              <CardContent sx={{ pt: 1, pb: 0, mb: 1 }}>
                <Box 
                  display="flex" 
                  alignItems="center"
                  onClick={(e) => handleProfileClick(post.userId, e)}
                  sx={{ 
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Avatar
                    sx={{ mr: 2, width: 40, height: 40 }}
                    src={post.user.profile?.avatarUrl || undefined}
                  >
                    {post.user.name ? post.user.name.charAt(0) : "N"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme === "dark" ? "#aaaaaa" : "#666666",
                      }}
                    >
                      {post.user.name || "Neznámy používateľ"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: theme === "dark" ? "#666666" : "#999999",
                        display: "block"
                      }}
                    >
                      {new Date(post.createdAt).toLocaleDateString('sk-SK')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardMedia
                component="img"
                height="240"
                image={post.imageUrl}
                alt={post.caption || "Príspevok bez popisu"}
                sx={{ objectFit: "cover" }}
              />

              <CardContent sx={{ pt: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme === "dark" ? "#dddddd" : "#000000",
                    mb: 1,
                  }}
                >
                  {post.caption || "Bez popisu"}
                </Typography>

                {/* Like and comment buttons */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={(e) => handleLike(post.id, e)}
                      sx={{ color: likes[post.id]?.some(like => like.userId === session?.user?.id) ? "red" : "inherit" }}
                    >
                      {likes[post.id]?.some(like => like.userId === session?.user?.id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Typography variant="body2">
                      {likes[post.id]?.length || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={(e) => handleCommentClick(post, e)}
                      sx={{ color: theme === "dark" ? "#aaaaaa" : "#666666" }}
                    >
                      <CommentIcon />
                    </IconButton>
                    <Typography variant="body2">
                      {comments[post.id]?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Comments Dialog */}
      <Dialog 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.95)' : '#ffffff',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme === 'dark' ? '#dddddd' : '#000000',
          borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          pb: 2
        }}>
          Komentáre k príspevku
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List>
            {selectedPost && comments[selectedPost.id]?.map((comment) => (
              <ListItem 
                key={comment.id}
                sx={{
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={comment.user.profile?.avatarUrl || undefined}
                    sx={{
                      border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {comment.user.name ? comment.user.name.charAt(0) : "N"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: theme === 'dark' ? '#dddddd' : '#000000',
                        fontWeight: 500
                      }}
                    >
                      {comment.user.name || "Neznámy používateľ"}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={{
                        color: theme === 'dark' ? '#aaaaaa' : '#666666'
                      }}
                    >
                      {comment.content}
                    </Typography>
                  }
                />
                {comment.userId === session?.user?.id && (
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteComment(comment.id)}
                    sx={{ 
                      color: "error.main",
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? 'rgba(211, 47, 47, 0.08)' : 'rgba(211, 47, 47, 0.04)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          gap: 1
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pridať komentár..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                '& fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                },
                '& input': {
                  color: theme === 'dark' ? '#dddddd' : '#000000',
                },
                '& input::placeholder': {
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              },
            }}
          />
          <Button 
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim()}
            sx={{
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#1976d2',
              color: theme === 'dark' ? '#ffffff' : '#ffffff',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#1565c0',
              },
              '&.Mui-disabled': {
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            Pridať
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostsView;
