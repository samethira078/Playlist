<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaylistSong extends Model
{
    use HasFactory;
    protected $fillable = [
        'playlist_id',
        'song_id',
    ];
    public $timestamps = false;

    public function playlist()
    {
        return $this->hasMany(Playlist::class, 'id', 'playlist_id');
    }
    public function song(){
        return $this->hasMany(Song::class, 'id', 'song_id');
    }

}
