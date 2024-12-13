// src/app/(public)/o-nas/AboutContent.tsx
"use client"

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTheme as useNextTheme } from "next-themes";

export default function AboutContent() {
  const { theme } = useNextTheme();

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 3
    }}>
      <Paper 
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          width: '100%',
          maxWidth: 800,
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Typography 
            variant="h3" 
            gutterBottom 
            align="center"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            O nás
          </Typography>

          <Typography 
            variant="body1"
            align="center"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000',
              marginBottom: 2
            }}
          >
            Vitajte na stránkach ZoškaSnap! Sme hrdí na našu školu a komunitu na SPŠE Zochova 9 v Bratislave.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              gap: 4,
              justifyContent: 'center',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            <Link 
              href="https://zochova.sk/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                textDecoration: 'none',
                fontFamily: 'Arial, sans-serif',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Naša škola
            </Link>
            <Link 
              href="https://www.facebook.com/spsezochova/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                textDecoration: 'none',
                fontFamily: 'Arial, sans-serif',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Facebook
            </Link>
            <Link 
              href="https://www.instagram.com/spsezochova/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme === 'dark' ? '#90caf9' : '#1976d2',
                textDecoration: 'none',
                fontFamily: 'Arial, sans-serif',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Instagram
            </Link>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
