// src/app/auth/registracia/page.tsx

"use client"; // Marks this file as a Client Component

import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';

// No metadata export here
export default function SignUp() {
  return (
    <>
      <Head>
        <title>Registracia | JakubGram</title>  {/* Set the title here */}
      </Head>


      <Typography variant="h4" gutterBottom>
        Registrácia
      </Typography>


      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => signIn('google')}
      >
        Sign up with Google
      </Button>


      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => signIn('facebook')}
      >
        Sign in with Facebook
      </Button>

      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => signIn('instagram')}
      >
        Sign in with Instagram
      </Button>
    </>
  );
}
