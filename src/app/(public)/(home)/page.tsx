"use client";

import { useSession, getSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useTheme as useNextTheme } from 'next-themes';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const { theme } = useNextTheme();

  useEffect(() => {
    const checkSession = async () => {
      const updatedSession = await getSession();
      if (updatedSession && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push('/prispevok');
      }
    };
    checkSession();
  }, [router]);

  return (
    <Container sx={{ py: 4 }}>
      {/* Circular hero image with conditional background color */}
      <Box 
        component="img"
        src="https://zochova.sk/public/images/logo_2.png" 
        alt="Welcome Hero"
        sx={{
          width: '150px',
          height: '150px',
          backgroundColor: theme === 'light' ? '#000' : 'white',
          borderRadius: '50%',
          mx: 'auto',
          mb: 3,
          p: 1,
          objectFit: 'cover'
        }}
      />
      {status === 'loading' ? (
        <Typography variant="h5">Načítava sa...</Typography>
      ) : status === 'authenticated' ? (
        <>
          <Typography variant="h4">Vitaj späť, {session?.user?.name}!</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Tu sú novinky pre teba. Urob si pohodlie a prezri si najnovší obsah našej komunity.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h4">Vitaj na ZoškaGrame!</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Prihlás sa, aby si získal viac funkcií a pripoj sa k našej aktívnej komunite. Objav svet zaujímavých noviniek a inšpiratívnych príbehov!
          </Typography>
        </>
      )}
    </Container>
  );
}
