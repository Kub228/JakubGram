"use client";

import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useTheme as useNextTheme } from "next-themes";

export default function SignUp() {
  const { theme } = useNextTheme();

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/prispevok' });
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Paper 
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Stack spacing={2}>
          <Head>
            <title>Prihlasenie | JakubGram</title>
          </Head>

          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Prihlasenie
          </Typography>

          <Typography 
            variant="body1"
            align="center"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000',
              marginBottom: 2,
              fontStyle: 'italic'
            }}
          >
            Tešíme sa, že sa k nám opäť prihlasujete
          </Typography>

          <Button 
            variant="outlined" 
            onClick={() => handleSignIn('google')}
            fullWidth
            sx={{
              height: 48,
              fontSize: '1.1rem',
              color: '#dd4b39',
              borderColor: '#dd4b39',
              '&:hover': {
                backgroundColor: '#dd4b39',
                color: 'white',
                borderColor: '#dd4b39'
              }
            }}
          >
            Sign in with Google
          </Button>

          <Button 
            variant="outlined" 
            onClick={() => handleSignIn('facebook')}
            fullWidth
            sx={{
              height: 48,
              fontSize: '1.1rem',
              color: '#4267B2',
              borderColor: '#4267B2',
              '&:hover': {
                backgroundColor: '#4267B2',
                color: 'white',
                borderColor: '#4267B2'
              }
            }}
          >
            Sign in with Facebook
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
