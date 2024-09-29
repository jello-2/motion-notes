import { useState } from "react";

const SpotifyCard = () => {
  const [playlistUrl, setPlaylistUrl] = useState("https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M");
  const [searchTerm, setSearchTerm] = useState("");

  const extractPlaylistId = (url) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const playlistId = extractPlaylistId(searchTerm);
    if (playlistId) {
      setPlaylistUrl(`https://open.spotify.com/embed/playlist/${playlistId}`);
      setSearchTerm("");
    } else {
      alert("Please enter a valid Spotify playlist URL.");
    }
  };

  return (
    <div className="card-body">
      <h2 className="text-lg font-semibold text-center mb-4">Spotify Playlist</h2>
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Enter Spotify Playlist URL"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-black flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition"
        >
          Load
        </button>
      </form>
      <div className="mt-6">
        <iframe
          className="rounded-lg"
          src={playlistUrl}
          width="100%"
          height="300"
          style={{ display: 'block', margin: 0, padding: 0 }} // Key adjustments
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default SpotifyCard;
