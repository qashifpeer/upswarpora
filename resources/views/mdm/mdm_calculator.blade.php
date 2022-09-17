@extends('myLayouts.app')

@section('main')
    <div>
        {{-- Container --}}
        <form action="{{ url('mdm/submit') }}" method="POST">
            @csrf

                <div class="pt-0 my-2 mx-8">
                    <p>Name Of The School</p>
                    <input type="text" placeholder="School name" id="name" name="school" tabindex="1" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                  </div>
                  <div class="flex space-x-6 my-2 mx-8">
                    <p>Select Month</p>
                    <select name="month" tabindex="2" id="" class="border-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5  ">
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="February">March</option>
                        <option value="04">April</option>
                        <option value="may">may</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </div>
            <div class="flex space-x-6">


                {{-- primary section --}}

                <div class="w-1/2">
                    primary
                    {{-- ul primary --}}
                    <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-1" name="p1" tabindex="3" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-2" name="p2" tabindex="5" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                       <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-3" name="p3" tabindex="7" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-4" name="p4" tabindex="9" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-5" name="p5" tabindex="11" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-6" name="p6" tabindex="13" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-7" name="p7" tabindex="15" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-8" name="p8" tabindex="17" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-9" name="p9" tabindex="19" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>


                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-10" name="p10" tabindex="21" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-11" name="p11" tabindex="23" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-12" name="p12" tabindex="25" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-13" name="p13" tabindex="27" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-14" name="p14" tabindex="29" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-15" name="p15" tabindex="31" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-16" name="p16" tabindex="33" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-17" name="p17" tabindex="35" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-18" name="p18" tabindex="37" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-19" name="p19" tabindex="39" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-20" name="p20" tabindex="41" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>

                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-21" name="p21" tabindex="43" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-22" name="p22" tabindex="45" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-23" name="p23" tabindex="47" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-24" name="p24" tabindex="49" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-25" name="p25" tabindex="51" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-26" name="p26" tabindex="53" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-27" name="p27" tabindex="55" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-28" name="p28" tabindex="57" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-29" name="p29" tabindex="59" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-30" name="p30" tabindex="61" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-31" name="p31" tabindex="63" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>





                </div>

                {{-- middle section --}}
                <div class="w-1/2">

                    <p>middle</p>
                    <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-1" name="m1" tabindex="4" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-2" name="m2" tabindex="6" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                       <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-3" name="m3" tabindex="8" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-4" name="m4" tabindex="10" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-5" name="m5" tabindex="12" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-6" name="m6" tabindex="14" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-7" name="m7" tabindex="16" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-8" name="m8" tabindex="18" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-9" name="m9" tabindex="20" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>


                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-10" name="m10" tabindex="22" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-11" name="m11" tabindex="24" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-12" name="m12" tabindex="26" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-13" name="m13" tabindex="28" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-14" name="m14" tabindex="30" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-15" name="m15" tabindex="32" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-16" name="m16" tabindex="34" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-17" name="m17" tabindex="36" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-18" name="m18" tabindex="38" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-19" name="m19" tabindex="40" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-20" name="m20" tabindex="42" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>

                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-21" name="m21" tabindex="44" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-22" name="m22" tabindex="46" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-23" name="m23" tabindex="48" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-24" name="m24" tabindex="50" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-25" name="m25" tabindex="52" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-26" name="m26" tabindex="54" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-27" name="m27" tabindex="56" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-28" name="m28" tabindex="58" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-29" name="m29" tabindex="60" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-30" name="m30" tabindex="62" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      <div class="pt-0 m-2">
                        <input type="number" placeholder="Day-31" name="m31" tabindex="64" class="px-3 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-1 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                </div>


            </div>
            <div class="text-center mt-4">
                <button type="submit" tabindex="65"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
            </div>
        </form>
    </div>
@endsection
