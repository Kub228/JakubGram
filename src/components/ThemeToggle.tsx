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
        color: theme === 'dark' ? '#ffffff' : '#000000',
        '&:hover': {
          color: theme === 'dark' ? '#ffffff' : '#000000',
        }
      }}
    >
      {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}
