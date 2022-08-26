<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;


class StudentController extends Controller
{
    public function show()
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


    public function searchStd(){
        return view('search-student');

    }

    public function searched_student(Request $request)
    {
        $request->validate([
            'enr_number'=> 'required',
        ]);
        $enr_number= $request->enr_number;
        //  dd($enr_number);

        if(Student::where('enr_number',$enr_number)->exists()){

            $data['students'] = Student::all()->where('enr_number',$enr_number);
            return view('searched_student', $data);
        }
        else{
            return back()->with('error', 'Student not found');
        }

    }

    public function bonafide($student){
        //  dd($student);
        $data=Student::all()->where('enr_number',$student);

        return view('bonafide',compact('data'));

    }
}
