<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    public function artist(){
        return $this->hasOne(Artist::class, 'id', 'artist_id');
    }
    public function genre(){
        return $this->hasOne(Genre::class, 'id', 'genre_id');
    }
}
