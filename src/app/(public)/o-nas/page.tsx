"use client"

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTheme as useNextTheme } from "next-themes";

export default function AboutContent() {
  const { theme } = useNextTheme();
  // Replace the URL below with your desired image link.
  const imageLink = "http://upload.wikimedia.org/wikipedia/commons/c/c7/Domestic_shorthaired_cat_face.jpg";

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
          <Box
            component="img"
            src={imageLink}
            alt="Profile Image"
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Typography 
            variant="body1"
            align="center"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000',
              marginBottom: 2
            }}
          >
            Vitajte na stránkach ZoškaSnap! Sme digitálnou platformou, ktorá spája študentov, učiteľov, absolventov a fanúšikov SPŠE Zochova 9 v Bratislave. Naša škola, známa svojou bohatou tradíciou a vysokou úrovňou vzdelávania, neustále napreduje a inováciami obohacuje svoj vzdelávací proces. {"\n\n"}
            Na tejto stránke nájdete aktuálne informácie o školských aktivitách, zaujímavé príbehy našich úspešných absolventov a novinky zo života nášho školského spoločenstva. Sme hrdí na komunitu, ktorá spája minulosť, prítomnosť a budúcnosť, a veríme, že každý člen prispieva k rastu a rozvoju tejto jedinečnej siete.
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
