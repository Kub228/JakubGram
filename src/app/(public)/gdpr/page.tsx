"use client";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useTheme as useNextTheme } from "next-themes";
import { useRouter } from 'next/navigation';

export default function GDPRContent() {
  const { theme } = useNextTheme();
  const router = useRouter();

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
        <Typography 
          variant="h3" 
          gutterBottom 
          align="center"
          sx={{ 
            color: theme === 'dark' ? '#ffffff' : '#000000',
            marginBottom: 4
          }}
        >
          GDPR - Ochrana osobných údajov
        </Typography>

        <Typography 
          variant="subtitle1" 
          paragraph
          sx={{ 
            color: theme === 'dark' ? '#ffffff' : '#000000',
            marginBottom: 4
          }}
        >
          V ZoškaSnap berieme ochranu vašich osobných údajov veľmi vážne. Naša GDPR politika jasne stanovuje, ako zbierame, uchovávame a využívame vaše informácie s cieľom zabezpečiť maximálnu transparentnosť a bezpečnosť. Sme odhodlaní chrániť vaše práva a zabezpečiť, že vaše súkromie je vždy na prvom mieste.
        </Typography>

        <Divider sx={{ marginY: 4 }} />

        <Box sx={{ marginBottom: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              marginBottom: 2
            }}
          >
            Zodpovednosť
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Vaša dôvera je pre nás mimoriadne cenná. Preto všetky osobné údaje, ktoré nám poskytnete, využívame výlučne na tie účely, pre ktoré boli zverené. Zaväzujeme sa přistupovať k vašim informáciám so zodpovednosťou a využívať prísne bezpečnostné opatrenia, aby sme zaistili, že vaše dáta sú vždy chránené.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              marginBottom: 2
            }}
          >
            Práva užívateľov
          </Typography>
          <Typography 
            variant="body1"
            sx={{ 
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Vaše práva sú pre nás prioritou. Máte úplné právo na prístup, opravu alebo vymazanie vašich osobných údajov, ako aj na obmedzenie ich spracovania. Ak máte otázky či požiadavky, neváhajte nás kontaktovať na adrese support@zoskasnap.sk – radi vám poskytneme všetky potrebné informácie.
          </Typography>
        </Box>

        <Divider sx={{ marginY: 4 }} />

        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            color: theme === 'dark' ? '#9e9e9e' : '#666666',
            fontStyle: 'italic'
          }}
        >
          Viac informácií nájdete v našich{' '}
          <Box
            component="span"
            onClick={() => router.push('/podmienky')}
            sx={{
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: theme === 'dark' ? '#64b5f6' : '#1565c0',
              }
            }}
          >
            Podmienkach používania
          </Box>
          .
        </Typography>

        {/* Back Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography 
            variant="button"
            onClick={() => router.back()}
            sx={{ 
              cursor: 'pointer', 
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              textDecoration: 'underline'
            }}
          >
            Späť
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
