// src\app\pridat\page.tsx

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const metadata = { title: 'Pridanie prispevku | ZoskaGram'};

export default function AddPost() {
  return (

    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Typography align="center">
        Pridanie prispevku
      </Typography>
    </Box>
  );
}