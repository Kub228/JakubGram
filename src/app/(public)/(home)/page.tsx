"use client"; // Indicate this is a Client Component

import { useSession, getSession } from 'next-auth/react';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { redirect } from 'next/dist/server/api-utils';

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Force-fetch the session to ensure it's up-to-date
    const checkSession = async () => {
      const updatedSession = await getSession();
      console.log('Updated session:', updatedSession);

      // Optional: Trigger a UI update or handle the session data
      if (!updatedSession) {
        console.log('No session found.');
      }
    };

    checkSession();
  }, []);

  return (
    <Container>
      {status === 'loading' ? (
        <Typography variant="h5">Načítava sa...</Typography>
      ) : status === 'authenticated' ? (
        <>
          <Typography variant="h4">Vitaj späť, {session?.user?.name}!</Typography>
          <Typography variant="body1">Tu sú novinky pre teba.</Typography>
        </>
      ) : (
        <>
          <Typography variant="h4">Vitaj na ZoškaGrame!</Typography>
          <Typography variant="body1">Prihlás sa, aby si získal viac funkcií.</Typography>
        </>
      )}
    </Container>
  );
}
