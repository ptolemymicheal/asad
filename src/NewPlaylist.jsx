import { useEffect, useState, useRef } from "react";
import axios from "axios";

const NewPlaylist = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
  const playlistId = import.meta.env.VITE_PLAYLIST_ID;

  const [latestTrack, setLatestTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const getAccessToken = async () => {
      const authEndpoint = "https://accounts.spotify.com/api/token";
      const encodedCredentials = btoa(`${clientId}:${clientSecret}`).toString(
        "base64"
      );

      try {
        const response = await axios.post(
          authEndpoint,
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${encodedCredentials}`,
            },
          }
        );

        return response.data.access_token;
      } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
      }
    };

    const fetchLatestTrackFromPlaylist = async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      const playlistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}`;

      try {
        const response = await axios.get(playlistEndpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const playlist = response.data;

        if (playlist.tracks && playlist.tracks.items.length > 0) {
          const latestAddedTrack = playlist.tracks.items.reduce(
            (latestTrack, track) => {
              if (
                !latestTrack ||
                new Date(track.added_at) > new Date(latestTrack.added_at)
              ) {
                return track;
              }
              return latestTrack;
            },
            null
          );

          if (latestAddedTrack) {
            setLatestTrack(latestAddedTrack.track);
          } else {
            console.error("Unable to determine the latest track.");
          }
        } else {
          console.error("No tracks found in the playlist.");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchLatestTrackFromPlaylist();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-5xl sm:text-7xl leading-[78px] text-center font-bold">
        A S<span className="text-2xl">ong</span> A D
        <span className="text-2xl">ay</span>
      </h1>
      {latestTrack ? (
        <div className="flex justify-between flex-col sm:flex-row items-center mt-[2%] sm:w-[90%] lg:w-[60%] mx-auto p-[2%] rounded-[40px] text-#191414 text-center">
          {/* image */}
          <div className="lg:w-[40%] p-[2%] sm:p-0 sm:w-[45%] mb-[10%] sm:mb-0">
            <img
              src={latestTrack.album.images[1].url}
              alt=""
              className={`rounded-full inline-block w-full ${
                isPlaying ? `animate-spin` : ``
              }`}
            />
          </div>

          <div className="w-full p-[2%] sm:p-0 sm:w-[50%]">
            <p className="text-lg">{latestTrack.artists[0].name}</p>
            <h2 className="text-4xl mb-[5%] font-bold text-[#1db954]">
              {latestTrack.name}
            </h2>
            <div className="mb-[5%]">
              {latestTrack.preview_url && (
                <audio
                  controls
                  className="mt-[1%] w-full"
                  onPlay={handlePlay}
                  onPause={handlePause}
                >
                  <source src={latestTrack.preview_url} type="audio/mpeg" />
                </audio>
              )}
            </div>
            <a
              href={latestTrack.external_urls.spotify}
              className="text-white hover:bg-[#1ed760] bg-[#1db954] py-[3%] px-[5%] rounded-[40px] my-[1%] inline-block w-full text-center text-xl"
            >
              Listen to Full Song
            </a>
          </div>
        </div>
      ) : (
        <div className="flex justify-between flex-col sm:flex-row items-center mt-[2%] sm:w-[90%] lg:w-[60%] mx-auto p-[2%] rounded-[40px] text-#191414 text-center">
          {/* image */}
          <div className="lg:w-[40%] p-[2%] sm:p-0 w-[45%] mb-[10%] sm:mb-0">
            <div className="lg:w-[100%] w-full rounded-full inline-block bg-[rgba(0,0,0,0.3)] aspect-square animate-pulse"></div>
          </div>

          <div className="w-full p-[2%] sm:p-0 sm:w-[50%] flex flex-col gap-y-4">
            <div className="w-full sm:w-[100%] flex flex-col gap-y-2">
              <div className="h-4 rounded-full animate-pulse bg-[rgba(0,0,0,0.3)]"></div>
              <div className="h-8 rounded-full animate-pulse bg-[rgba(0,0,0,0.3)]"></div>
            </div>

            <div className="h-16 rounded-full animate-pulse bg-[rgba(0,0,0,0.3)]"></div>
            <a
              href="#"
              className="text-white py-[3%] px-[5%] rounded-[40px] my-[1%] inline-block w-full text-center text-xl animate-pulse bg-[#1db954]"
            >
              Listen to Full Song
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPlaylist;
