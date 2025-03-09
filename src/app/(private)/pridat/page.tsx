'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

// MUI imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

// Server actions
import { createPost } from '@/app/actions/posts';

export default function AddPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Obrázok je príliš veľký. Maximálna veľkosť je 5MB.');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setShowValidation(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      router.push('/prihlasenie');
      return;
    }

    if (!selectedImage || !caption.trim()) {
      setShowValidation(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setShowValidation(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      // Upload image to Cloudinary through our API route
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Nepodarilo sa nahrať obrázok');
      }

      const { url } = await uploadResponse.json();

      // Create post with the image URL
      await createPost(session.user.id, url, caption || undefined);

      // Redirect to home page or posts page
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Nastala chyba pri vytváraní príspevku. Skúste to znova.');
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          color: theme === 'dark' ? '#ffffff' : '#000000',
          textAlign: 'center',
          fontWeight: 600,
          mb: 4
        }}
      >
        Pridať nový príspevok
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card 
          elevation={theme === 'dark' ? 0 : 1}
          sx={{ 
            mb: 3,
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            borderRadius: '16px',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardContent>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              {imagePreview ? (
                <Box position="relative" width="100%">
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      borderRadius: '12px'
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                  >
                    <DeleteIcon sx={{ color: '#fff' }} />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f5f5f5',
                    borderRadius: '12px',
                    border: '2px dashed',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#bdbdbd',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#eeeeee'
                    }
                  }}
                  component="label"
                >
                  <PhotoCamera sx={{ fontSize: 60, color: theme === 'dark' ? '#666' : '#999', mb: 2 }} />
                  <Typography variant="body1" color={theme === 'dark' ? '#666' : '#999'}>
                    Kliknite pre výber fotky
                  </Typography>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Popis príspevku"
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
            setShowValidation(false);
          }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              color: theme === 'dark' ? '#fff' : 'inherit',
              '& fieldset': {
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.7)',
              },
              '&:hover fieldset': {
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#000',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme === 'dark' ? '#fff' : '#000',
              },
            },
            '& .MuiInputLabel-root': {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              '&.Mui-focused': {
                color: theme === 'dark' ? '#fff' : '#000',
              },
            },
          }}
        />

        {showValidation && (
          <Fade in={true}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2,
                borderRadius: '12px'
              }}
            >
              Pre pridanie príspevku je potrebné vybrať fotku a pridať popis
            </Alert>
          </Fade>
        )}

        {error && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '12px'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ 
            height: 48,
            fontSize: '1.1rem',
            borderRadius: '12px',
            textTransform: 'none',
            backgroundColor: theme === 'dark' ? '#fff' : '#000',
            color: theme === 'dark' ? '#000' : '#fff',
            '&:hover': {
              backgroundColor: theme === 'dark' ? '#f5f5f5' : '#333'
            }
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            'Pridať príspevok'
          )}
        </Button>
      </form>
    </Container>
  );
}
