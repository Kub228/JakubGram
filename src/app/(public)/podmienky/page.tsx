// src/app/podmienky/TermsContent.tsx
"use client"

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useTheme as useNextTheme } from "next-themes";

export default function TermsContent() {
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
        <Typography 
          variant="h3" 
          gutterBottom 
          align="center"
          sx={{ 
            color: theme === 'dark' ? '#ffffff' : '#000000',
            marginBottom: 4
          }}
        >
          Podmienky používania
        </Typography>

        <Typography 
          variant="subtitle1" 
          paragraph
          sx={{ 
            color: theme === 'dark' ? '#ffffff' : '#000000',
            marginBottom: 4
          }}
        >
          Tieto podmienky upravujú používanie aplikácie ZoškaSnap. Pred použitím našej aplikácie si prosím dôkladne prečítajte tieto podmienky.
        </Typography>

        <Divider sx={{ marginY: 4 }} />

        <Box sx={{ marginBottom: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              marginBottom: 2
            }}
          >
            Používanie aplikácie
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Užívateľ sa zaväzuje používať aplikáciu v súlade so zákonmi a dobrými mravmi.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              marginBottom: 2
            }}
          >
            Ochrana údajov
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Vaše údaje sú spracovávané v súlade s našimi zásadami ochrany osobných údajov.
          </Typography>
        </Box>

        <Divider sx={{ marginY: 4 }} />

        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            color: theme === 'dark' ? '#9e9e9e' : '#666666',
            fontStyle: 'italic'
          }}
        >
          Ďakujeme, že dodržiavate podmienky používania našej aplikácie.
        </Typography>
      </Paper>
    </Box>
  );
}
