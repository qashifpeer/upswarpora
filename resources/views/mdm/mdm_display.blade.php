@extends('mdm.layouts.app') @section('main')
    {{-- Main Container --}}
    <div class="overflow-hidden w-full h-full mx-auto px-4 bg-gradient-to-b from-blue-400 to-red-400">


        {{-- header --}}

        <div class="flex flex-col mb-1 mt-2 py-2 w-full bg-gradient-to-b from-purple-600 to-indigo-700 rounded-lg">
            <span id="school" class="text-white font-bold text-center text-3xl capitalize"></span>
            <div class="flex space-x-3 justify-center">
                <p id="month" class="text-white font-bold text-center text-xl underline capitalize"></p>
                <p id="year" class="text-white font-bold text-center text-lg underline capitalize"></p>
            </div>
        </div>
        {{-- Table Container --}}
        <div class="table_container flex flex-col md:flex-row">
            <div class="consumption_table">


                <table class="border-collapse border">
                    <thead>
                        <tr>
                            <th class="text-xs py-4 bg-slate-600 text-black">Date</th>
                            <th class="w-24 py-4 text-xs bg-slate-700 text-black">Primary Meals</th>
                            <th class="w-24 py-4 text-xs bg-slate-600 text-black">Middle meals</th>
                            <th class="w-24 py-4 text-xs bg-slate-700 text-black">Rice Utilized</th>
                            <th class="w-24 py-4 text-xs bg-slate-600 text-black">Expenditure</th>
                            <!-- <th class="text-xs border-r-2 border-gray-400 bg-slate-700 text-white">Expenditure Total</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <!-- ***** DAY-1******** -->
                        <tr class="">
                            <td class="text-xs bg-blue-400 px-2">Day-1</td>
                            <td>
                                <input type="text" id="meals_p1" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m1" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d1" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d1" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-2******** -->
                        <tr class="">
                            <td class="text-xs bg-blue-400 px-2">Day-2</td>
                            <td>
                                <input type="text" id="meals_p2" readonly
                                    class="form-control block w-full py-1 text-center text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m2" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d2" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d2" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-3******** -->
                        <tr class="">
                            <td class="text-xs bg-blue-400 px-2">Day-3</td>
                            <td>
                                <input type="text" id="meals_p3" readonly
                                    class="form-control block w-full py-1 text-center text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m3" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d3" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d3" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-4 ******** -->
                        <tr class="">
                            <td class="text-xs bg-blue-400 px-2">Day-4</td>
                            <td>
                                <input type="text" id="meals_p4" readonly
                                    class="form-control block w-full py-1 text-center text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m4" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d4" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d4" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-5 ******** -->
                        <tr class=" ">
                            <td class="text-xs bg-blue-400 px-2">Day-5</td>
                            <td>
                                <input type="text" id="meals_p5" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m5" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d5" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d5" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-6 ******** -->
                        <tr class=" ">
                            <td class="text-xs bg-blue-400 px-2">Day-6</td>
                            <td>
                                <input type="text" id="meals_p6" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m6" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d6" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d6" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-7 ******** -->
                        <tr class=" ">
                            <td class="text-xs bg-blue-400 px-2">Day-7</td>
                            <td>
                                <input type="text" id="meals_p7" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m7" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d7" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d7" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-8 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-8</td>
                            <td>
                                <input type="text" id="meals_p8" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m8" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d8" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d8" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-9 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-9</td>
                            <td>
                                <input type="text" id="meals_p9" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m9" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d9" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d9" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-10 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-10</td>
                            <td>
                                <input type="text" id="meals_p10" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m10" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d10" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d10" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-11 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-11</td>
                            <td>
                                <input type="text" id="meals_p11" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m11" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d11" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d11" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-12 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-12</td>
                            <td>
                                <input type="text" id="meals_p12" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m12" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d12" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d12" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-13 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-13</td>
                            <td>
                                <input type="text" id="meals_p13" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m13" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d13" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d13" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-14 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-14</td>
                            <td>
                                <input type="text" id="meals_p14" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m14" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d14" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d14" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-15 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-15</td>
                            <td>
                                <input type="text" id="meals_p15" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m15" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d15" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d15" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-16 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-16</td>
                            <td>
                                <input type="text" id="meals_p16" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m16" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d16" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d16" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-17 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-17</td>
                            <td>
                                <input type="text" id="meals_p17" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m17" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d17" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d17" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-18 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-18</td>
                            <td>
                                <input type="text" id="meals_p18" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m18" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d18" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d18" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-19 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-19</td>
                            <td>
                                <input type="text" id="meals_p19" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m19" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d19" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d19" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-20 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-20</td>
                            <td>
                                <input type="text" id="meals_p20" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m20" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d20" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d20" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-21 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-21</td>
                            <td>
                                <input type="text" id="meals_p21" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m21" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d21" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d21" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-22 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-22</td>
                            <td>
                                <input type="text" id="meals_p22" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m22" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d22" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d22" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-23 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-23</td>
                            <td>
                                <input type="text" id="meals_p23" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m23" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d23" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d23" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-24 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-24</td>
                            <td>
                                <input type="text" id="meals_p24" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m24" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d24" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d24" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-25 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-25</td>
                            <td>
                                <input type="text" id="meals_p25" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m25" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d25" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d25" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-26 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-26</td>
                            <td>
                                <input type="text" id="meals_p26" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m26" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d26" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d26" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-27 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-27</td>
                            <td>
                                <input type="text" id="meals_p27" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m27" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d27" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d27" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-28 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-28</td>
                            <td>
                                <input type="text" id="meals_p28" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m28" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d28" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d28" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-29 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-29</td>
                            <td>
                                <input type="text" id="meals_p29" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m29" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d29" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d29" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-30 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-30</td>
                            <td>
                                <input type="text" id="meals_p30" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m30" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d30" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d30" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>

                        <!-- ***** DAY-31 ******** -->
                        <tr>
                            <td class="text-xs bg-blue-400 px-2">Day-31</td>
                            <td>
                                <input type="text" id="meals_p31" readonly
                                    class="form-control block w-full py-1 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="meals_m31" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="rice_d31" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                            <td>
                                <input type="text" id="exp_d31" readonly
                                    class="form-control block w-full py-1 text-sm font-normal text-center text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {{-- Cashbook Details --}}
            <div class="cashbook_table">
               <div class="m-2">
                    <table>


                    <tbody class="border-2">
                        <tr>
                            <th class="border-r-2 bg-indigo-800 text-white" colspan="2" >Primary Section</th>
                       </tr>

                            <tr>
                                <td class="border-2 w-56 px-2" >Total Income Received</td>
                                <td id="pr_income" class="w-32 text-center"></td>
                            </tr>
                            <tr>
                                <td class="border-2 px-2" >Expenditure For the Month</td>
                                <td  class="border-2 w-32 text-center" id="pr_exp"></td>
                            </tr>
                            <tr class="bg-yellow-100">
                                <td class="border-2 px-2" >Balance (Pry)</td>
                                <td class="border-2 w-32 text-center" id="pr_balance" ></td>
                            </tr>
                            {{-- Middle Component --}}
                            <tr class="border-2">
                                <th class="border-r-2 bg-indigo-800 text-white" colspan="2" >Middle Section</th>
                            </tr>
                            <tr>
                                <td class="border-2 px-2" >Total Income Received</td>
                                <td id="md_income" class="w-32 text-center"></td>
                            </tr>
                            <tr>
                                <td class="border-2 px-2" >Expenditure For the Month</>
                                <td  class="border-2 w-32 text-center" id="md_exp"></td>
                            </tr>
                            <tr class="bg-yellow-100">
                                <td class="border-2 px-2" >Balance (Middle)</td>
                                <td class="border-2 w-32 text-center" id="md_balance" ></td>
                            </tr>

                            <tr class="bg-gray-900 text-white">
                                <th class="border-2 py-3" >Closing Balance</th>
                                <th class="border-2" id="closing_balance"></th>
                            </tr>
                        </tbody>

                    </table>
               </div>
            </div>

            {{-- Cashbook Details --}}
            <div class="cashbook_table">
                <div class="m-2">
                     <table>


                     <tbody class="border-2">
                         <tr>
                             <th class="border-r-2 bg-indigo-800 text-white" colspan="2">Rice-Details (PRIMARY)</th>
                        </tr>

                             <tr>
                                 <td class="border-2 w-56 px-2" >Last Balance</td>
                                 <td id="pr_rice_lb" class="w-32 text-center"></td>
                             </tr>
                             <tr>
                                 <td class="border-2 px-2" >Rice Lifted </td>
                                 <td  class="border-2 w-32 text-center" id="pr_rice_lifted"></td>
                             </tr>
                             <tr>
                                <td class="border-2 px-2" >Rice Consumed </td>
                                <td  class="border-2 w-32 text-center" id="pr_rice_consumed"></td>
                            </tr>
                             <tr class="bg-yellow-100">
                                 <td class="border-2 px-2" >Balance (Pry)</td>
                                 <td class="border-2 w-32 text-center" id="pr_rice_balance" ></td>
                             </tr>
                             {{-- Middle Component --}}
                             <tr class="border-2">
                                 <th class="border-r-2 bg-indigo-800 text-white" colspan="2">Rice-Details (PRIMARY)</th>
                             </tr>
                             <tr>
                                 <td class="border-2 px-2" >Last Balance</td>
                                 <td id="md_rice_lb" class="w-32 text-center"></td>
                             </tr>
                             <tr>
                                 <td class="border-2 px-2" >Rice Lifted</>
                                 <td  class="border-2 w-32 text-center" id="md_rice_lifted"></td>
                             </tr>
                             <tr>
                                <td class="border-2 px-2" >Rice Consumed</>
                                <td  class="border-2 w-32 text-center" id="md_rice_consumed"></td>
                            </tr>
                             <tr class="bg-yellow-100">
                                 <td class="border-2 px-2" >Balance (Middle)</td>
                                 <td class="border-2 w-32 text-center" id="md_rice_balance" ></td>
                             </tr>

                             <tr class="bg-gray-900 text-white">
                                 <th class="border-2 py-3" >Closing Balance</th>
                                 <th class="border-2" id="rice_closing_balance"></th>
                             </tr>
                         </tbody>

                     </table>
                </div>
             </div>
        </div>

    </div>

    <script src="{{ asset('mdm_display.js') }}"></script>
@endsection
