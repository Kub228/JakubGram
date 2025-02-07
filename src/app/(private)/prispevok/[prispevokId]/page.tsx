// src\app\prispevok\[prispevokId]\page.tsx

import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export const metadata = { title: 'Detail prispevku | ZoskaGram'};

export default async function PostDetail({
  params,
}: {
  params: Promise<{
    prispevokId: string
  }>;
}) {
  const { prispevokId } = await params;

  return (
    <Container>
      <Typography>Detail prispevku: {prispevokId}</Typography>
    </Container>
  );
}
