<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    //
    public function user_Login(Request $request){
        //Validate request
        $field = $request->validate([
            'name' => 'required|string|min:3',
            'password' => 'required|string|min:3'
        ]);
        //Check if entry exists
        $user = User::where('name', $field['name'])->first();

        //If entry doesn't exist, return false
        if(!$user || !Hash::check($field['password'], $user->password)){
            //Return false
            return response([
                'message' => 'Failed to login.'
            ],401);
        }

        //Create token
        $token = $user->createToken('web')->plainTextToken;

        //Return data
        $response = [
            'user' => $user,
            'token' => $token
        ];
        return response($response, 201);
    }

    public function user_register(Request $request){
        //Validate login fields
        $field = $request->validate([
            'name' => 'required|string|unique:users,name',
            'password' => 'required|string|confirmed',
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
