// src\app\prispevok\[prispevokId]\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

// MUI imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import DeleteIcon from '@mui/icons-material/Delete';

// Server actions import
import { 
  fetchPostById, 
  likePost, 
  unlikePost, 
  getPostLikes,
  addComment,
  getPostComments,
  deleteComment
} from '@/app/actions/posts';

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

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const postId = params.prispevokId as string;

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPostById(postId);
        setPost(fetchedPost);
        
        // Load likes and comments
        const [fetchedLikes, fetchedComments] = await Promise.all([
          getPostLikes(postId),
          getPostComments(postId)
        ]);
        
        setLikes(fetchedLikes);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  // Like handlers
  const handleLike = async () => {
    if (!session?.user?.id || !post) return;

    try {
      const isLiked = likes.some(like => like.userId === session.user.id);
      if (isLiked) {
        await unlikePost(post.id, session.user.id);
        setLikes(prev => prev.filter(like => like.userId !== session.user.id));
      } else {
        const newLike = await likePost(post.id, session.user.id);
        setLikes(prev => [...prev, newLike]);
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  // Comment handlers
  const handleAddComment = async () => {
    if (!post || !session?.user?.id || !newComment.trim()) return;

    try {
      const comment = await addComment(post.id, session.user.id, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return;

    try {
      await deleteComment(commentId, session.user.id);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleProfileClick = () => {
    if (post?.userId) {
      if (post.userId === session?.user?.id) {
        router.push('/profil');
      } else {
        router.push(`/profil/${post.userId}`);
      }
    }
  };

  const cardBackground = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgb(225, 225, 225)';

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, p: 2 }}>
        <Typography>Načítavam príspevok...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 2 }}>
      <IconButton 
        onClick={handleBack}
        sx={{ mb: 2, color: theme === 'dark' ? '#ffffff' : '#000000' }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Grid container spacing={3}>
        {/* Post Image */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: cardBackground, borderRadius: '25px', overflow: 'hidden' }}>
            {/* Post Author */}
            <CardContent>
              <Box 
                display="flex" 
                alignItems="center" 
                mb={2}
                onClick={handleProfileClick}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <Avatar
                  sx={{ mr: 2 }}
                  src={post.user.profile?.avatarUrl || undefined}
                >
                  {post.user.name ? post.user.name.charAt(0) : 'N'}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {post.user.name || 'Neznámy používateľ'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}
                  >
                    {new Date(post.createdAt).toLocaleDateString('sk-SK')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardMedia
              component="img"
              image={post.imageUrl}
              alt={post.caption || 'Post image'}
              sx={{ 
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />

            {post.caption && (
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme === 'dark' ? '#dddddd' : '#000000',
                  }}
                >
                  {post.caption}
                </Typography>
              </CardContent>
            )}

            {/* Like and comment buttons */}
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={handleLike}
                    sx={{ 
                      color: likes.some(like => like.userId === session?.user?.id) 
                        ? "red" 
                        : theme === "dark" ? "#aaaaaa" : "#666666"
                    }}
                  >
                    {likes.some(like => like.userId === session?.user?.id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <Typography 
                    variant="body2"
                    sx={{ color: theme === "dark" ? "#aaaaaa" : "#666666" }}
                  >
                    {likes.length}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={handleAddComment}
                    sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                  >
                    <CommentIcon />
                  </IconButton>
                  <Typography 
                    variant="body2"
                    sx={{ color: theme === "dark" ? "#aaaaaa" : "#666666" }}
                  >
                    {comments.length}
                  </Typography>
                </Box>
              </Box>

              {/* Comments section */}
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: theme === 'dark' ? '#dddddd' : '#000000',
                    fontWeight: 500
                  }}
                >
                  Komentáre
                </Typography>
                <List>
                  {comments.map((comment) => (
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
                          {comment.user.name ? comment.user.name.charAt(0) : 'N'}
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

                {/* Add comment form */}
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
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
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
