<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Models\PlaylistSong;
use Illuminate\Http\Request;
use App\Models\User;


class PlaylistController extends Controller
{
    public function getPlaylist(){
        return Playlist::where('user_id', '=', auth()->user()->id)->get();
    }
    public function getPlaylistSongs(Request $request){
//        echo $request->id;
        return PlaylistSong::with(['song', 'playlist'])->whereHas('playlist', function($q) {
            $q->where('user_id', '=', auth()->user()->id);})->where('playlist_id', '=', $request->id)->get();
    }

    public function addSongToPlaylist(Request $request){
        $playlist_exists = Playlist::where('user_id', '=', auth()->user()->id)
            ->where('id', '=', $request->playlist_id)
            ->first();

        if (is_null($playlist_exists)) {
            return response([
                'message' => 'Error.'
            ],403);
        }
        $song_exists = PlaylistSong::where('playlist_id', '=', $request->playlist_id)
            ->where('song_id', '=', $request->song_id)
            ->first();
        if (!is_null($song_exists)) {
            return response([
                'message' => 'Song exists.'
            ],400);
        }
        else {
            $song = new PlaylistSong;
            $song->song_id = $request->song_id;
            $song->playlist_id = $request->playlist_id;
            $song->save();
        }
        return response([
            'message' => 'Added'
        ],200);
    }
    public function removeSongFromPlaylist(Request $request){
        echo $request;
        $playlist_exists = Playlist::where('user_id', '=', auth()->user()->id)
            ->where('id', '=', $request->playlist)
            ->first();
        if (is_null($playlist_exists)) {
            return response([
                'message' => 'error.'
            ],403);
        }
        foreach ($request->songs as $song){
            PlaylistSong::destroy($song);
        }
    }
    public function createPlaylist(Request $request){
        $playlist_exists = Playlist::where('user_id', '=', auth()->user()->id)
            ->where('name', '=', $request->name)
            ->first();
        if (!is_null($playlist_exists)) {
            return response([
                'message' => 'error.'
            ],403);
        }
    }
    public function savePlaylist(Request $request){
        if(is_numeric(auth()->user()->id)){
            $playlist = new Playlist;
            $playlist->name = $request->playlist['name'];
            $playlist->user_id = auth()->user()->id;
            $playlist->save();

            foreach ($request->playlist['songs'] as $lied){
                $song = new PlaylistSong;
                $song->song_id = $lied['song_id'];
                $song->playlist_id = $playlist['id'];
                $song->save();
            }
        }
//        echo $request;

    }
    public function removePlaylist(Request $request){
        $playlist_exists = Playlist::where('user_id', '=', auth()->user()->id)
            ->where('id', '=', $request->id)
            ->first();
        if (!is_null($playlist_exists)) {
           Playlist::destroy($request->id);
        }
    }
}
