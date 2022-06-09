<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'name',
        'user_id',
    ];
    public function playlistsong(){
        return $this->belongsTo('App\Models\PlaylistSong');
    }
}
