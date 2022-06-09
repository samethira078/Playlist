<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;

class Songs extends Controller
{
    public function list(){
        return Song::with('artist')->with('genre')->get();
    }
}
