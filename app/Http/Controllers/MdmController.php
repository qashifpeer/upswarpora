<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MdmController extends Controller
{
    public function index(){
        return view('mdm.try');
    }

    public function display(){

        return view('mdm.mdm_display');
    }



}
