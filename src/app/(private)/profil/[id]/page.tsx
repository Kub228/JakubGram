// src\app\profil\[id]\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useParams, useRouter } from 'next/navigation';

// MUI imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InterestsIcon from '@mui/icons-material/Interests';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Server actions import
import { fetchProfileByUserId } from '@/app/actions/profiles';
import { fetchPostsByUserId } from '@/app/actions/posts';

// Interfaces
interface Profile {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: {
    name: string | null;
  };
}

interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
  };
}

export default function ProfileDetail() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const { theme } = useTheme();
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();

  useEffect(() => {
    const loadProfileAndPosts = async () => {
      try {
        // Fetch profile data
        const profileData = await fetchProfileByUserId(userId);
        setProfile(profileData);

        // Fetch user's posts
        const userPosts = await fetchPostsByUserId(userId);
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to fetch profile or posts:', error);
      }
    };

    if (userId) {
      loadProfileAndPosts();
    }
  }, [userId]);

  const handleBack = () => {
    router.back();
  };

  const cardBackground = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgb(225, 225, 225)';

  const handlePostClick = (postId: string) => {
    router.push(`/prispevok/${postId}`);
  };

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, p: 2 }}>
        <Typography>Načítavam profil...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, p: 2 }}>
      <IconButton 
        onClick={handleBack}
        sx={{ 
          mb: 2, 
          color: theme === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Profile Information Card */}
      <Card sx={{ backgroundColor: cardBackground, borderRadius: '25px', mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{ width: 120, height: 120, mr: 3 }}
              src={profile.avatarUrl || undefined}
            >
              {profile.user.name ? profile.user.name.charAt(0) : 'N'}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
              >
                {profile.user.name || 'Neznámy používateľ'}
              </Typography>
              {profile.location && (
                <Box display="flex" alignItems="center" mt={1}>
                  <LocationOnIcon sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666', mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}
                  >
                    {profile.location}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {profile.bio && (
            <Typography
              variant="body1"
              sx={{
                color: theme === 'dark' ? '#dddddd' : '#333333',
                mb: 2,
              }}
            >
              {profile.bio}
            </Typography>
          )}

          {profile.interests.length > 0 && (
            <Box mt={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <InterestsIcon sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666', mr: 1 }} />
                <Typography
                  variant="body1"
                  sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}
                >
                  Záujmy
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {profile.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    sx={{
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Posts Section */}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: theme === 'dark' ? '#dddddd' : '#000000',
        }}
      >
        Príspevky používateľa
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: cardBackground,
                borderRadius: '15px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => handlePostClick(post.id)}
            >
              <CardMedia
                component="img"
                height="240"
                image={post.imageUrl}
                alt={post.caption || 'Post image'}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                {post.caption && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme === 'dark' ? '#dddddd' : '#000000',
                    }}
                  >
                    {post.caption}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: theme === 'dark' ? '#aaaaaa' : '#666666',
                    display: 'block',
                    mt: 1,
                  }}
                >
                  {new Date(post.createdAt).toLocaleDateString('sk-SK')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {posts.length === 0 && (
        <Typography
          sx={{
            color: theme === 'dark' ? '#aaaaaa' : '#666666',
            textAlign: 'center',
            mt: 4,
          }}
        >
          Používateľ zatiaľ nemá žiadne príspevky
        </Typography>
      )}
    </Container>
  );
}