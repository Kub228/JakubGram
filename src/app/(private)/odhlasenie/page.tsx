"use client";

import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useTheme as useNextTheme } from "next-themes";

export default function SignOut() {
  const { theme } = useNextTheme();

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
            <title>Odhlasenie | JakubGram</title>
          </Head>

          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Odhlásenie
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
            Je nám ľúto, že nás opúšťate. Dúfame, že sa čoskoro vrátite späť!
          </Typography>

          <Button
            variant="outlined" 
            onClick={() => signOut()}
            fullWidth
            sx={{
              height: 48,
              fontSize: '1.1rem',
              backgroundColor: 'transparent',
              color: '#1976d2',
              borderColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1976d2',
                color: 'white',
                borderColor: '#1976d2'
              }
            }}
          >
            Sign Out
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
