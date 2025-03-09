"use client";

import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useTheme as useNextTheme } from "next-themes";
import Link from '@mui/material/Link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';

export default function SignUp() {
  const { theme } = useNextTheme();
  const router = useRouter();
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSignIn = (provider: string) => {
    if (!gdprAccepted) {
      setShowError(true);
      return;
    }
    setShowError(false);
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
        <Stack spacing={3} alignItems="center">
          <Head>
            <title>Registracia | JakubGram</title>
          </Head>

          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Registrácia
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={gdprAccepted}
                onChange={(e) => {
                  setGdprAccepted(e.target.checked);
                  setShowError(false);
                }}
                sx={{
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  '&.Mui-checked': {
                    color: theme === 'dark' ? '#90caf9' : '#1976d2',
                  },
                }}
              />
            }
            label={
              <Box component="span" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                Súhlasím s{' '}
                <Link
                  href="/gdpr"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/gdpr');
                  }}
                  sx={{
                    color: theme === 'dark' ? '#90caf9' : '#1976d2',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  GDPR
                </Link>
                {' '}a{' '}
                <Link
                  href="/gdpr"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/podmienky');
                  }}
                  sx={{
                    color: theme === 'dark' ? '#90caf9' : '#1976d2',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Podmienkami pouzivania
                </Link>
              </Box>
            }
          />

          {showError && (
            <Alert severity="error" sx={{ width: '100%' }}>
              Pre prihlásenie je potrebné súhlasiť s GDPR podmienkami
            </Alert>
          )}

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
            Sign up with Google
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
            Sign up with Facebook
          </Button>

          <Typography 
            variant="body2"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Už máte účet?{' '}
            <Link
              href="/prihlasenie"
              onClick={(e) => {
                e.preventDefault();
                router.push('/prihlasenie');
              }}
              sx={{
                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Prihláste sa tu
            </Link>
          </Typography>
          
        </Stack>
      </Paper>
    </Box>
  );
}
