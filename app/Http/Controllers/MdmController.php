<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MdmController extends Controller
{
    public function index(){
        return view('mdm');
    }

    public function calculate(Request $request){

        $school = $request->school;
        $month = $request->month;

        $day1 = ($request->p1  * 4.97)+ ($request->m1  * 7.45);
        $day2 = ($request->p2  * 4.97)+ ($request->m2  * 7.45);
        $day3 = ($request->p3  * 4.97)+ ($request->m3  * 7.45);
        $day4 = ($request->p4  * 4.97)+ ($request->m4  * 7.45);
        $day5 = ($request->p5  * 4.97)+ ($request->m5  * 7.45);
        $day6 = ($request->p6  * 4.97)+ ($request->m6  * 7.45);
        $day7 = ($request->p7  * 4.97)+ ($request->m7  * 7.45);
        $day8 = ($request->p8  * 4.97)+ ($request->m8  * 7.45);
        $day9 = ($request->p9  * 4.97)+ ($request->m9  * 7.45);
        $day10 = ($request->p10  * 4.97)+($request->m10  * 7.45);

        $day11 = ($request->p11  * 4.97)+($request->m11  * 7.45);
        $day12 = ($request->p12  * 4.97)+($request->m12  * 7.45);
        $day13 = ($request->p13  * 4.97)+($request->m13  * 7.45);
        $day14 = ($request->p14  * 4.97)+($request->m14  * 7.45);
        $day15 = ($request->p15  * 4.97)+($request->m15  * 7.45);
        $day16 = ($request->p16  * 4.97)+($request->m16  * 7.45);
        $day17 = ($request->p17  * 4.97)+($request->m17  * 7.45);
        $day18 = ($request->p18  * 4.97)+($request->m18  * 7.45);
        $day19 = ($request->p19  * 4.97)+($request->m19  * 7.45);
        $day20 = ($request->p20  * 4.97)+($request->m20  * 7.45);

        $day21 = ($request->p21  * 4.97)+($request->m21  * 7.45);
        $day22 = ($request->p22  * 4.97)+($request->m22  * 7.45);
        $day23 = ($request->p23  * 4.97)+($request->m23  * 7.45);
        $day24 = ($request->p24  * 4.97)+($request->m24  * 7.45);
        $day25 = ($request->p25  * 4.97)+($request->m25  * 7.45);
        $day26 = ($request->p26  * 4.97)+($request->m26  * 7.45);
        $day27 = ($request->p27  * 4.97)+($request->m27  * 7.45);
        $day28 = ($request->p28  * 4.97)+($request->m28  * 7.45);
        $day29 = ($request->p29  * 4.97)+($request->m29  * 7.45);
        $day30 = ($request->p30  * 4.97)+($request->m30  * 7.45);
        $day31 = ($request->p31  * 4.97)+($request->m31  * 7.45);


        // $total_meals = $day1+$day2+$day3+$day4+$day5+$day6+$day7+$day8+$day9+$day10
        // +$day11+$day12+$day13+$day14+$day15+$day16+$day17+$day18+$day19+$day20
        // +$day21+$day22+$day23+$day24+$day25+$day26+$day27+$day28+$day29+$day30+$day31;

        // dd($total_meals);
        return  view('mdm_display',compact('day1','day2','day3','day4','day5','day6','day7','day8','day9','day10','day11','day12','day13','day14','day15','day16','day17','day18','day19','day20','day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31','school','month'));


    }
}
