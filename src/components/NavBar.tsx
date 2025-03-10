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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from "@/components/ThemeToggle"
import { useTheme as useNextTheme } from "next-themes"
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { fetchProfileByUserId } from '@/app/actions/profiles';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState('/');
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme } = useNextTheme();
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.id) {
        try {
          const profile = await fetchProfileByUserId(session.user.id);
          if (profile?.avatarUrl) {
            setProfileAvatar(profile.avatarUrl);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const handleNavigation = (newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    router.push('/odhlasenie');
  };

  // Custom icon component for profile that shows either Avatar or PersonIcon
  const ProfileIcon = () => {
    if (profileAvatar) {
      return (
        <Avatar 
          src={profileAvatar} 
          sx={{ 
            width: 24, 
            height: 24,
            '.MuiBottomNavigationAction-root.Mui-selected &': {
              width: 26,
              height: 26,
            }
          }}
        />
      );
    }
    return <PersonIcon />;
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
              icon={<ProfileIcon />}
              onClick={handleProfileClick}
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
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            bgcolor: theme === 'dark' ? '#1a1a1a' : 'background.paper',
            color: theme === 'dark' ? '#fff' : '#000',
            marginBottom: '8px'
          }
        }}
      >
        <MenuItem onClick={handleClose}>Profil</MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Odhlásiť sa
        </MenuItem>
      </Menu>
      
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
  