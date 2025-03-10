"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

// Server action import
import { fetchProfiles } from "@/app/actions/profiles";

// Profile interface
interface Profile {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: {
    name: string | null;
  };
}

const ProfilesSearchView = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const fetchedProfiles = await fetchProfiles("");
        setProfiles(fetchedProfiles);
        setFilteredProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    loadProfiles();
  }, []);

  useEffect(() => {
    const filterProfiles = async () => {
      if (searchTerm.trim() === "") {
        setFilteredProfiles(profiles);
      } else {
        try {
          const fetchedProfiles = await fetchProfiles(searchTerm);
          setFilteredProfiles(fetchedProfiles);
        } catch (error) {
          console.error("Failed to fetch filtered profiles:", error);
        }
      }
    };

    const debounceTimer = setTimeout(filterProfiles, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, profiles]);

  // Determine card background based on theme
  const cardBackground = theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgb(225, 225, 225)";

  const handleProfileClick = (userId: string) => {
    if (userId === session?.user?.id) {
      router.push('/profil');
    } else {
      router.push(`/profil/${userId}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 2, borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, color: theme === "dark" ? "#dddddd" : "#000000" }}>
        Vyhľadať profily
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Vyhľadať používateľov..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme === "dark" ? "#aaaaaa" : "#666666" }} />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        {filteredProfiles.map((profile) => (
          <Grid item xs={12} key={profile.id}>
            <Card
              sx={{
                backgroundColor: cardBackground,
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.9,
                },
                borderRadius: "15px",
              }}
              onClick={() => handleProfileClick(profile.userId)}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{ mr: 2, width: 50, height: 50 }}
                    src={profile.avatarUrl || undefined}
                  >
                    {profile.user.name ? profile.user.name.charAt(0) : "N"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {profile.user.name || "Neznámy používateľ"}
                    </Typography>
                    {profile.location && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme === "dark" ? "#aaaaaa" : "#666666",
                        }}
                      >
                        {profile.location}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {profile.bio && (
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      color: theme === "dark" ? "#dddddd" : "#333333",
                    }}
                  >
                    {profile.bio}
                  </Typography>
                )}
                {profile.interests.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme === "dark" ? "#aaaaaa" : "#666666",
                      }}
                    >
                      Záujmy: {profile.interests.join(", ")}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProfilesSearchView; 