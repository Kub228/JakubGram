// src\app\profil\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

// MUI imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InterestsIcon from '@mui/icons-material/Interests';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';

// Server actions import
import { fetchProfileByUserId, updateProfile } from '@/app/actions/profiles';
import { fetchPostsByUserId, deletePost } from '@/app/actions/posts';

// Types
interface Profile {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: {
    name: string | null;
    email: string;
  };
}

interface Post {
  id: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const { theme } = useTheme();
  const router = useRouter();

  // Edit profile state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedAvatar, setEditedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileAndPosts = async () => {
      if (!session?.user?.id) {
        router.push('/prihlasenie');
        return;
      }

      try {
        const userProfile = await fetchProfileByUserId(session.user.id);
        setProfile(userProfile);
        setEditedBio(userProfile?.bio || '');
        setEditedLocation(userProfile?.location || '');
        setAvatarPreview(userProfile?.avatarUrl || null);

        const userPosts = await fetchPostsByUserId(session.user.id);
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to fetch profile or posts:', error);
      }
    };

    loadProfileAndPosts();
  }, [session, router]);

  const cardBackground = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgb(225, 225, 225)';

  const handlePostClick = (postId: string) => {
    router.push(`/prispevok/${postId}`);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleClearAvatar = () => {
    setEditedAvatar(null);
    setAvatarPreview(null);
  };

  const handleEditSubmit = async () => {
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    try {
      let avatarUrl = profile?.avatarUrl;

      if (editedAvatar) {
        const formData = new FormData();
        formData.append('file', editedAvatar);

        // Upload using our API route
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || 'Failed to upload image');
        }

        const { url } = await uploadResponse.json();
        avatarUrl = url;
      } else if (avatarPreview === null) {
        // If avatarPreview is null, it means we want to clear the avatar
        avatarUrl = null;
      }

      const updatedProfile = await updateProfile(session.user.id, {
        bio: editedBio || null,
        location: editedLocation || null,
        avatarUrl: avatarUrl,
      });
      
      setProfile(updatedProfile);
      setIsEditDialogOpen(false);
      setEditedAvatar(null);
      
      // Reset the URL object to prevent memory leaks
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Nepodarilo sa aktualizovať profil. Prosím, skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent post click when deleting
    if (!session?.user?.id) return;

    if (window.confirm('Naozaj chcete vymazať tento príspevok?')) {
      try {
        await deletePost(postId, session.user.id);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
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
      {/* Profile Card */}
      <Card sx={{ backgroundColor: cardBackground, borderRadius: '25px', mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={profile.avatarUrl || undefined}
                sx={{ width: 100, height: 100, mr: 3 }}
              >
                {profile.user.name ? profile.user.name.charAt(0) : 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  {profile.user.name || 'Používateľ'}
                </Typography>
                <Typography variant="body1" sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}>
                  {profile.user.email}
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            >
              Upraviť profil
            </Button>
          </Box>

          {profile.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: theme === 'dark' ? '#aaaaaa' : '#666666' }} />
              <Typography sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}>
                {profile.location}
              </Typography>
            </Box>
          )}

          {profile.bio && (
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                color: theme === 'dark' ? '#dddddd' : '#000000'
              }}
            >
              {profile.bio}
            </Typography>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InterestsIcon sx={{ mr: 1, color: theme === 'dark' ? '#aaaaaa' : '#666666' }} />
                <Typography sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}>
                  Záujmy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

      {/* Edit Profile Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: theme === 'dark' ? 'rgb(25, 25, 25)' : '#ffffff',
            borderRadius: '16px',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme === 'dark' ? '#fff' : '#000',
          borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          Upraviť profil
          <IconButton
            onClick={handleEditClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          pt: 3,
          backgroundColor: theme === 'dark' ? 'rgb(25, 25, 25)' : '#ffffff',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={avatarPreview || undefined}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {profile.user.name ? profile.user.name.charAt(0) : 'U'}
            </Avatar>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                size="small"
                sx={{
                  color: theme === 'dark' ? '#fff' : '#000',
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                  '&:hover': {
                    borderColor: theme === 'dark' ? '#fff' : '#000',
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                Zmeniť fotku
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
              {(avatarPreview || profile.avatarUrl) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  size="small"
                  onClick={handleClearAvatar}
                >
                  Vymazať
                </Button>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: theme === 'dark' ? '#fff' : 'inherit',
                '& fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme === 'dark' ? '#fff' : '#000',
                },
              },
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Lokalita"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                color: theme === 'dark' ? '#fff' : 'inherit',
                '& fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme === 'dark' ? '#fff' : '#000',
                },
              },
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: theme === 'dark' ? '#fff' : '#000',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          backgroundColor: theme === 'dark' ? 'rgb(25, 25, 25)' : '#ffffff',
        }}>
          <Button 
            onClick={handleEditClose}
            sx={{
              color: theme === 'dark' ? '#fff' : '#000',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            Zrušiť
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            disabled={isSubmitting}
            sx={{
              backgroundColor: theme === 'dark' ? '#fff' : '#000',
              color: theme === 'dark' ? '#000' : '#fff',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#f5f5f5' : '#333',
              }
            }}
          >
            {isSubmitting ? 'Ukladám...' : 'Uložiť'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Posts Grid */}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3,
          color: theme === 'dark' ? '#ffffff' : '#000000'
        }}
      >
        Moje príspevky
      </Typography>

      <Grid container spacing={2}>
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
                position: 'relative',
              }}
              onClick={() => handlePostClick(post.id)}
            >
              <IconButton
                onClick={(e) => handleDeletePost(post.id, e)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                  zIndex: 1,
                }}
              >
                <DeleteIcon sx={{ color: '#ffffff' }} />
              </IconButton>
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt={post.caption || 'Post image'}
                sx={{ objectFit: 'cover' }}
              />
              {post.caption && (
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme === 'dark' ? '#dddddd' : '#000000',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.caption}
                  </Typography>
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
              )}
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
          Zatiaľ nemáte žiadne príspevky
        </Typography>
      )}
    </Container>
  );
}