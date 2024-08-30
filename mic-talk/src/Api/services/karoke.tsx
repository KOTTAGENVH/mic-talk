import { apiClient } from "../axios/api";

// Define an interface for the expected API response
interface KaraokeResponse {
  lyrics: any;
}

// Karaoke API
export const Karaoke = async (artist: any, song: any) => {
  try {
    // Replace spaces with underscores
    const formattedArtist = artist.replace(/\s+/g, "_");
    const formattedSong = song.replace(/\s+/g, "_");

    const url = `/${formattedArtist}/${formattedSong}`;
    console.log("Karaoke API URL:", url);
    const response = await apiClient.get(url);
    if (response.status !== 200) {
      console.error("Request failed:", response);
    }
    return response.data as KaraokeResponse;
  } catch (error) {
    console.error("Error occurred:", error);
    return error;
  }
};
