import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const metadata = { title: 'Zoznam prispevkov | ZoskaGram'};

export default function PostList() {
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Typography align="center">
        Zoznam prispevkov
      </Typography>
    </Box>
  );
}
