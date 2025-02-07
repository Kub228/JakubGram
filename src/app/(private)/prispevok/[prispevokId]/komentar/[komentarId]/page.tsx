// src\app\prispevok\[prispevokId]\komentar\[komentarId]\page.tsx

import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export const metadata = { title: 'Detail komentara | ZoskaGram'};

export default async function CommentDetail({ 
  params,
}: {
  params: Promise<{
    prispevokId: string,
    komentarId: string
  }>;
}) {
  const { prispevokId, komentarId } = await params;

  return (
    <Container>
      <Typography>Detail komentaru cislo: {komentarId} k prispevku {prispevokId}</Typography>
      <Typography>prispevok cislo: {prispevokId} a komentar k nemu cislo: {komentarId}</Typography>
    </Container>
  );
}
