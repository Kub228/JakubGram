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

  return (
    <Container
      sx={{
        mt: 4,
        padding: 2,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, color: theme === "dark" ? "#dddddd" : "#000000" }}
      >
        Príspevky
      </Typography>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ backgroundColor: "transparent" }}>
              <CardMedia
                component="img"
                height="140"
                image={post.imageUrl}
                alt={post.caption || "Príspevok bez popisu"}
              />
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{ color: theme === "dark" ? "#dddddd" : "#000000" }}
                >
                  {post.caption || "Bez popisu"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme === "dark" ? "#dddddd" : "#000000" }}
                >
                  {post.user.name || "Neznámy používateľ"}
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
