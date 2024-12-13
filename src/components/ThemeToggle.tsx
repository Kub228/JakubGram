"use client"

import { useTheme } from "next-themes"
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <IconButton 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      sx={{ 
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        '&:hover': {
          color: theme === 'dark' ? '#fff' : '#1976d2',
        }
      }}
    >
      {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}
