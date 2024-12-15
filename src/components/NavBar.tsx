"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from "@/components/ThemeToggle"
import { useTheme as useNextTheme } from "next-themes"

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState('/');
  const router = useRouter();
  const { status } = useSession();
  const { theme } = useNextTheme();

  const handleNavigation = (newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          handleNavigation(newValue);
        }}
        sx={{
          bgcolor: theme === 'dark' ? '#1a1a1a' : 'background.paper',
          borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
          '& .MuiBottomNavigationAction-root': {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'gray',
            '&:hover': {
              color: theme === 'dark' ? '#fff' : '#000000',
            },
            '&.Mui-selected': {
              color: theme === 'dark' ? '#fff' : '#000000',
            },
            '& .MuiTouchRipple-root': {
              color: theme === 'dark' ? '#fff' : '#000000',
            }
          },
          '& .MuiIconButton-root': {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'gray',
            '&:hover': {
              color: theme === 'dark' ? '#fff' : '#000000',
            },
            '& .MuiTouchRipple-root': {
              color: theme === 'dark' ? '#fff' : '#000000',
            }
          },
          display: 'flex',
          justifyContent: 'center',
          paddingRight: '48px'
        }}
      >
        <BottomNavigationAction 
          label="Domov" 
          value={'/'} 
          icon={<HomeIcon />} 
        />

        {status === 'authenticated' ? (
          [
            <BottomNavigationAction 
              key="hladat" 
              label="Hľadať" 
              value={'/hladanie'} 
              icon={<SearchIcon />} 
            />,
            <BottomNavigationAction 
              key="pridat" 
              label="Pridať" 
              value={'/pridat'} 
              icon={<AddCircleIcon />} 
            />,
            <BottomNavigationAction 
              key="profil" 
              label="Profil" 
              value={'/profil'} 
              icon={<PersonIcon />} 
            />,
            <BottomNavigationAction 
              key="odhlasit" 
              label="Odhlásiť" 
              value={'/odhlasenie'} 
              icon={<LogoutIcon />} 
            />,
          ]
        ) : (
          [
            <BottomNavigationAction 
              key="o-nas" 
              label="o-nas" 
              value={'/o-nas'} 
              icon={<InfoIcon />} 
            />,
            <BottomNavigationAction 
              key="prihlasenie" 
              label="Prihlásenie" 
              value={'/prihlasenie'} 
              icon={<LoginIcon />} 
            />,
            <BottomNavigationAction 
              key="registracia" 
              label="Registrácia" 
              value={'/registracia'} 
              icon={<HowToRegIcon />} 
            />,
          ]
        )}
      </BottomNavigation>
      
      <Box sx={{ 
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '8px',
        '& .MuiIconButton-root': {
          color: theme === 'dark' ? '#ffffff' : '#000000'
        }
      }}>
        <ThemeToggle />
      </Box>
    </Box>
  );
}
  