"use client";

import { useSession, getSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      const updatedSession = await getSession();
      
      if (updatedSession && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push('/prispevok'); // or whatever route you want to redirect to
      }
    };

    checkSession();
  }, [router]);

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