<?php

namespace App\Http\Controllers;

use App\Models\MarkSheet;
use App\Models\Student;
use Illuminate\Http\Request;


class StudentController extends Controller
{
    public function index()
    {


        return view('admin.add_student');
    }

    public function store(Request $request)
    {


        $request->validate([

            'enr_number'=> 'required',
            'adm_number'=> 'required',
            'name'=> 'required',
            'father_name'=> 'required',
            'mother_name'=> 'required',
            'dob'=> 'required',
            'class'=> 'required',



        ]);


        $student= new Student();
        $student-> enr_number = $request->enr_number;
        $student-> adm_number = $request->adm_number;
        $student-> name = $request->post('name');
        $student-> father_name = $request->father_name;
        $student-> mother_name = $request->mother_name;
        $student-> dob = $request->dob;
        $student-> class = $request->class;

        $student->save();

        return redirect()->back();

    }
    public function show(){

        $students= Student::all();
            return view('admin.view_student',compact('students'));
        //dd($students);

    }
}
