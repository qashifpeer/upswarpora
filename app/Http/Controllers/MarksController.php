<?php

namespace App\Http\Controllers;

use App\Models\MarkSheet;
use Illuminate\Http\Request;
use App\Models\Student;

class MarksController extends Controller
{

    public function index($student)
    {
        $data= Student::all()->where('enr_number',$student);
        //  dd($data);
        return view('admin.add_marks', compact('data'));
    }

    public function store(Request $request){
        //  dd($request->all());



        $request->validate([

             'enr_number'=> 'required|unique:mark_sheets|max:255',
            'maths'=> ['required' , 'integer', 'max:255'],
            'english'=> ['required' , 'integer' ,'max:255'],
            'science'=> ['required' , 'integer' , 'max:255'],
            'urdu'=> ['required' , 'integer' , 'max:255'],
            'kashmiri'=> ['required' , 'integer' , 'max:255'],



        ]);

        $marksSheet= new MarkSheet();

        $enr_number = $request->enr_number;

        $maths = $request->maths;
        $english = $request->english;
        $science = $request->science;
        $sst = $request->sst;
        $urdu = $request->urdu;
        $kashmiri = $request->kashmiri;

        if($request->sst){
            $total_marks='600';
            $max_marks= '100';
        } else{
            $total_marks='500';
            $max_marks= '0';
        }

        $marks_obtained= $maths + $english + $science + $sst + $urdu + $kashmiri;
        $percentage = round(($marks_obtained/$total_marks) * 100);



        $marksSheet-> enr_number = $enr_number;
        $marksSheet-> maths = $maths;
        $marksSheet-> english = $english;
        $marksSheet-> science = $science;
        $marksSheet-> sst = $sst;
        $marksSheet-> urdu = $urdu;
        $marksSheet-> kashmiri = $kashmiri;
        $marksSheet-> total_marks = $total_marks;
        $marksSheet-> marks_obtained = $marks_obtained;
        $marksSheet-> percentage = $percentage;
        $marksSheet-> session = '2022';
        $marksSheet-> max_marks = $max_marks;
        $marksSheet->marks_status= 'Completed';

        // dd($marks_obtained);

         $marksSheet->save();

         return back()->with('error', ' Data Saved Successfully');


    }


}
