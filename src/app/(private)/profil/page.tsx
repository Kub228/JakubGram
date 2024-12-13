// src\app\profil\page.tsx

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const metadata = { title: 'Zoznam profilov | ZoskaGram'};

export default function ProfileList() {
  return (

    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Typography align="center">
        Zoznam profilov
      </Typography>
    </Box>

  );
}