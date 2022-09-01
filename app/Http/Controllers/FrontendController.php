<?php

namespace App\Http\Controllers;

use App\Models\MarkSheet;
use Illuminate\Http\Request;
use App\Models\Student;

class FrontendController extends Controller
{
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
    public function marksSheet($student){



        $marks=MarkSheet::all()->where('enr_number',$student);
        $students=Student::all()->where('enr_number',$student);
        //    dd($students);

        return view('marksCard', compact('marks','students'));



    }
}
