// src/app/actions/profiles.ts

"use server";

// Import Prisma client
import { prisma } from "@/lib/prisma";

// Fetch profiles based on search term
export const fetchProfiles = async (searchTerm: string) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          { user: { name: { contains: searchTerm, mode: "insensitive" } } },
          { interests: { has: searchTerm } },
        ],
      },
      include: { user: true }, // Include user data
    });

    return profiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw new Error("Could not fetch profiles");
  }
};

// Get or create a profile for a user
export const getOrCreateProfile = async (userId: string) => {
  try {
    let profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      // Create a new profile if one doesn't exist
      profile = await prisma.profile.create({
        data: {
          userId,
          interests: [], // Default empty interests array
        },
        include: { user: true },
      });
    }

    return profile;
  } catch (error) {
    console.error("Error in getOrCreateProfile:", error);
    throw new Error("Could not get or create profile");
  }
};

// Fetch a single profile by user ID
export const fetchProfileByUserId = async (userId: string) => {
  try {
    // Use getOrCreateProfile instead of just fetching
    return await getOrCreateProfile(userId);
  } catch (error) {
    console.error("Error fetching profile by userId:", error);
    throw new Error("Could not fetch profile");
  }
};

// Update profile
export const updateProfile = async (userId: string, data: { 
  bio?: string | null; 
  location?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
}) => {
  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        bio: data.bio,
        location: data.location,
        avatarUrl: data.avatarUrl,
        user: {
          update: {
            name: data.name,
          },
        },
      },
      include: { user: true },
    });

    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Could not update profile");
  }
};

// Upload avatar to Cloudinary
export const uploadAvatar = async (file: FormData) => {
  "use server";
  
  try {
    const uploadResponse = await fetch(
      'https://api.cloudinary.com/v1_1/dxghtqsao/image/upload',
      {
        method: 'POST',
        body: file,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const uploadData = await uploadResponse.json();
    return uploadData.secure_url;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Could not upload avatar");
  }
};
