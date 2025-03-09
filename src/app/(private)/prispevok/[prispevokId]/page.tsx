// src\app\prispevok\[prispevokId]\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

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

// Server actions import
import { fetchPostById } from '@/app/actions/posts';

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

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const postId = params.prispevokId as string;

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPostById(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  const handleBack = () => {
    router.back();
  };

  const handleProfileClick = () => {
    if (post?.userId) {
      router.push(`/profil/${post.userId}`);
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
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
