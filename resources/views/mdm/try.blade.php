@extends('mdm.layouts.app') @section('main')
    <div class="w-full min-h-screen bg-no-repeat bg-cover flex justify-center scroll-auto" style="background-image: url('img/bg-1.jpg');">
        <div>
            <form action="{{ url('/mdm-display') }}" method="get">
                @csrf

                {{-- HEADER STARTS --}}
                    <div class="bg-white p-2">

                        {{-- SCHOOL DETAILS STARTS --}}
                            <div class="flex w-full mb-1">
                               {{-- School Label --}}
                                <label for="school" class="w-1/3 py-1 px-4 bg-blue-100 rounded-3xl form-label inline-block mb-1 text-black text-sm">Enter School  Name </label>

                                {{-- School INPUT --}}
                                <input type="text"
                                    class="w-64 form-control block text-sm px-2 py-1 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="school" placeholder="School Name" />

                            </div> {{-- /school details --}}

                        {{-- Select Month --}}
                        <div class="w-full flex">
                            <label for="month" class="w-1/3 py-1 px-4 bg-blue-100 rounded-3xl form-label inline-block mb-1 text-black text-sm">Select Period
                            </label>
                            <select id="month"
                                class="form-control block w-36 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                                <option selected>Select Month</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>

                            {{-- Year --}}
                            <span class="w-24 ">
                                <select id="year"
                                class="w-24 ml-4 form-control block px-0 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                                <option selected>Select Year</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>

                            </select>
                            </span>
                        </div>
                    </div> {{-- Header Ends --}}

                {{-- Table Contents --}}
                <table class="table-auto border-collapse border border-slate-500">
                    <thead>
                        <tr class="border border-b-1 border-gray-800 bg-gray-700 text-white">
                            <th>Date</th>
                            <th>Primary Meals</th>
                            <th>Middle meals</th>
                        </tr>
                    </thead>
                    <tbody>

                        {{-- Day-1 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-1</td>
                            <td class="px-2 mb-2">
                                <input type="number" id="meals-pr-d1" name="p1"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d1"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-2 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-2</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d2" name="p1"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d2"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-3 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-3</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d3"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d3"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-4 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-4</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d4"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d4"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-5 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-5</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d5"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d5"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-6 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-6</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d6"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d6"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-7 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-7</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d7"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d7"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-8 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-8</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d8"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d8"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-9 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-9</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d9"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d9"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-10 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-10</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d10"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d10"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-11 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-11</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d11"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d11"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-12 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-12</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d12"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d12"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-13 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-13</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d13"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d13"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-14 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-14</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d14"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d14"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-15 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-15</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d15"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d15"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-16 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-16</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d16"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d16"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-17 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-17</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d17"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d17"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-18 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-18</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d18"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d18"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-19 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-19</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d19"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d19"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-20 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-20</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d20"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d20"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-21 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-21</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d21"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d21"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-22 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-22</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d22"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d22"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-23 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-23</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d23"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d23"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-24 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-24</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d24"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d24"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-25 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-25</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d25"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d25"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-26 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-26</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d26"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d26"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-27 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-27</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d27"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d27"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-28 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-28</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d28"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d28"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-29 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-29</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d29"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d29"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-30 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-30</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d30"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d30"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>

                        {{-- Day-31 --}}
                        <tr>
                            <td class="px-2 text-sm font-bold">Day-31</td>
                            <td class="px-2">
                                <input type="number" id="meals-pr-d31"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                            <td>
                                <input type="number" id="meals-md-d31"
                                    class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div>
                    {{-- Expenditure Table --}}
                    <table>
                        <tbody>
                            <tr>
                                <th class="border-2 bg-blue-700 text-white" colspan="4">Expenditure Details- (Rs)</th>
                            </tr>
                            <tr class="bg-blue-400">
                                <th class="border-2" colspan="2">Primary</th>

                                <th class="border-2" colspan="2">Middle</th>

                            </tr>
                            <tr class="bg-blue-200">
                                <td class="border-2 w-28 text-sm">Bal. B Fwd</td>
                                <td class="border-2"><input type="number" id="pr_bf" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>
                                <td class="border-2 text-sm w-28 ">Bal. B.Fwd</td>
                                <td class="border-2"><input type="number" id="md_bf" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>

                            </tr>
                            <tr class="bg-blue-200">
                                <td class="border-2 w-28 text-sm">Income Received</td>
                                <td class="border-2"><input type="number" id="pr_income" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>
                                <td class="border-2 text-sm">Income Received</td>
                                <td class="border-2"><input type="number" id="md_income" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>
                            </tr>


                        </tbody>
                    </table>
                    {{-- Rice Consumption Table  --}}
                    <table>
                        <tbody>
                            <tr>
                                <th class="border-2 bg-blue-700 text-white" colspan="4">Rice Consumption Details - (kg)</th>
                            </tr>
                            <tr class="bg-blue-400">
                                <th class="border-2" colspan="2">Primary</th>

                                <th class="border-2" colspan="2">Middle</th>

                            </tr>
                            <tr class="bg-fuchsia-200">
                                <td class="border-2 w-28 text-sm">Last Balance</td>
                                <td class="border-2"><input type="number" id="pr_rice_lb" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>
                                <td class="border-2 text-sm w-28 ">Last Balance</td>
                                <td class="border-2"><input type="number" id="md_rice_lb" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>

                            </tr>
                            <tr class="bg-fuchsia-200">
                                <td class="border-2 w-28 text-sm">Rice Lifted</td>
                                <td class="border-2"><input type="number" id="pr_rice_lifted" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>
                                <td class="border-2 text-sm">Rice Lifted</td>
                                <td class="border-2"><input type="number" id="md_rice_lifted" onchange="setTwoNumberDecimal" min="0" max="50000" step="any" value="0.00"
                                    class="form-control block w-20 px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center" /></td>
                            </tr>


                        </tbody>
                    </table>

                </div>

                <div class="btn flex justify-center my-6">
                    <button type="submit" id="btn" class="bg-[#003668] hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full">Submit</button>
                </div>
            </form>
        </div>
    </div>
    <script src="{{ asset('mdm.js') }}"></script>
@endsection
