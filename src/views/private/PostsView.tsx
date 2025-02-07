"use client";

// React imports
import { useEffect, useState } from "react";

// next-themes import
import { useTheme } from "next-themes";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

// Server action import
import { fetchPosts } from "@/app/actions/posts";

// Post interface
interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    // Optionally, you can add a profileImage property here in the future:
    // profileImage?: string;
  };
}

const PostsView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts: Post[] = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    loadPosts();
  }, []);

  // Determine card background based on theme:
  const cardBackground =
    theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgb(225, 225, 225)";

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, color: theme === "dark" ? "#dddddd" : "#000000" }}
      >
        Príspevky
      </Typography>
      <Grid container spacing={2} direction="column">
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card
              sx={{
                width: "100%",
                backgroundColor: cardBackground,
                display: "flex",
                flexDirection: "column",
                borderRadius: "25px",
                overflow: "hidden",
              }}
            >
              {/* User's name with profile picture */}
              <CardContent sx={{ pt: 1, pb: 0, mb: 1 }}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{ mr: 2, width: 40, height: 40 }}
                    // If a profileImage URL is added to the user data, update src accordingly:
                    // src={post.user.profileImage}
                  >
                    {post.user.name ? post.user.name.charAt(0) : "N"}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme === "dark" ? "#aaaaaa" : "#666666",
                    }}
                  >
                    {post.user.name || "Neznámy používateľ"}
                  </Typography>
                </Box>
              </CardContent>
              <CardMedia
                component="img"
                height="240"
                image={post.imageUrl}
                alt={post.caption || "Príspevok bez popisu"}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ pt: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme === "dark" ? "#dddddd" : "#000000",
                  }}
                >
                  {post.caption || "Bez popisu"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsView;
