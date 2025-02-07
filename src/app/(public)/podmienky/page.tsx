"use client";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useTheme as useNextTheme } from "next-themes";
import { useRouter } from 'next/navigation';

export default function TermsContent() {
  const { theme } = useNextTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          border: theme === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid rgba(0, 0, 0, 0.12)',
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
            marginBottom: 4,
          }}
        >
          Podmienky používania
        </Typography>

        <Typography
          variant="subtitle1"
          paragraph
          sx={{
            color: theme === 'dark' ? '#ffffff' : '#000000',
            marginBottom: 4,
          }}
        >
          Tieto podmienky predstavujú základný rámec, ktorým sa riadime pri poskytovaní aplikácie ZoškaSnap. Naším cieľom je zabezpečiť, aby ste sa cítili bezpečne a informovane pri používaní našej platformy. Prosím, dôkladne si prečítajte tieto podmienky, aby ste boli oboznámení so svojimi právami a povinnosťami.
        </Typography>

        <Divider sx={{ marginY: 4 }} />

        <Box sx={{ marginBottom: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              marginBottom: 2,
            }}
          >
            Používanie aplikácie
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme === 'dark' ? '#ffffff' : '#000000',
            }}
          >
            Používanie našej aplikácie vyžaduje, aby ste sa správali zodpovedne a s rešpektom voči ostatným. Zaväzujete sa využívať ZoškaSnap v súlade s platnými zákonmi a etickými zásadami. Spoločne vytvárame bezpečné a priateľské prostredie, ktoré podporuje otvorenú a konštruktívnu komunikáciu.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              marginBottom: 2,
            }}
          >
            Ochrana údajov
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme === 'dark' ? '#ffffff' : '#000000',
            }}
          >
            Ochrana vašich osobných údajov je pre nás mimoriadne dôležitá. Vaše informácie spracovávame s maximálnou starostlivosťou a v súlade s platnými právnymi predpismi a našimi internými zásadami ochrany údajov. Máte právo na prístup, opravu či vymazanie svojich údajov a vždy sa môžete na nás obrátiť, ak máte akékoľvek otázky.
          </Typography>
        </Box>

        <Divider sx={{ marginY: 4 }} />

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: theme === 'dark' ? '#9e9e9e' : '#666666',
            fontStyle: 'italic',
          }}
        >
          Ďakujeme, že ste si prečítali naše podmienky a že prispievate k vytváraniu bezpečného a transparentného prostredia v aplikácii ZoškaSnap.
        </Typography>

        {/* Back Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant="button"
            onClick={() => router.back()}
            sx={{
              cursor: 'pointer',
              color: theme === 'dark' ? '#90caf9' : '#1976d2',
              textDecoration: 'underline',
            }}
          >
            Späť
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
