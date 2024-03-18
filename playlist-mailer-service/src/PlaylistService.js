const { Pool } = require('pg');
 
class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }
 
  async getListSongByPlaylistId(playlistId) {
    const query = {
        text: `SELECT s.id, s.title, s.performer FROM songs s 
        JOIN playlist_songs ps ON s.id = ps.song_id 
        join playlists p on ps.playlist_id = p.id
        WHERE p.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    // let {name, id} = result.rows[0] 
    // return {playlist: {id, name, songs: result.rows}};
    return result.rows;
  }

  async getPlaylistName(playlistId){
    const query = {
      text: `SELECT id,name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    console.log(result.rows);
    return result.rows[0];
  }
}


module.exports = PlaylistService;