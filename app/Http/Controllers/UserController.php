<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;


class UserController extends Controller
{
    //
    public function demo(){
        return 'lol';
    }
    public function user_register(Request $request){
        //Validate login fields
        $field = $request->validate([
            'name' => 'required|string|unique:users,name',
            'password' => 'required|string'
        ]);

        //Create user table
        $user = User::create([
            'name' => $field['name'], 'role' => 2,
            'password' => bcrypt($field['password'])
        ]);

        //Create token
        $token = $user->createToken('web')->plainTextToken;

        //Return data
        $response = [
            'user' => $user,
            'token' => $token
        ];
        return response($response, 201);
    }
}
