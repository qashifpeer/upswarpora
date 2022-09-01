@extends('myLayouts.app')
@section('main')
    <div class="border-2 m-2 border-black border-dashed rounded-2xl mx-auto lg:w-1/2 ">
        @foreach ($students as $student)
            <h1 class="m-2 text-center font-extrabold text-3xl sm:text-5xl">Govt. Upper Primary School Warpora</h1>
            <h2 class="text-center underline sm:text-lg ">Annual 2021</h2>
            <h2 class="text-end mr-3 text-sm text-red-600 sm:mr-8 sm:text-lg">Enroll No: <span class="font-bold text-black underline">
                    {{ $student->enr_number }}</span> </h2>

            <div class="ml-4 flex space-x-3 text-sm">
                <ul>
                    <li class="sm:text-lg text-blue-700">Name:</li>
                    <li class="sm:text-lg text-blue-700">Parentage:</li>
                    <li class="sm:text-lg text-blue-700">D.O.B:</li>
                    <li class="sm:text-lg text-blue-700">Class:</li>
                </ul>
                <ul>
                    <li class="font-bold uppercase sm:text-lg ">{{ $student->name }}</li>
                    <li class="font-bold uppercase sm:text-lg ">{{ $student->father_name }}</li>
                    <li class="font-bold sm:text-lg ">{{ $student->dob }}</li>
                    <li class="font-bold capitalize sm:text-lg ">{{ $student->class }}</li>
                </ul>
            </div>
            {{-- date --}}
            <p class="text-end text-xs underline text-gray-600 mx-6 mb-6">Date: {{ date('d-m-Y') }}</p>




            {{-- Marks Table --}}
            <table class="text-sm shadow-lg my-2  bg-white text-center border-separate border-2 border-black mx-auto sm:text-lg sm:w-1/2">
                <thead>
                    <tr>
                        <th class="bg-blue-100 border text-left px-1 py-4 sm:px-8">Subject</th>
                        <th class="bg-blue-100 border text-left px-1 py-4 sm:px-8">Max Marks</th>
                        <th class="bg-blue-100 border text-left px-1 py-4 sm:px-8">Marks Obtained</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border px-1 py-2 text-left">English</td>
                        <td class="border px-1 py-2">100</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->english }}</td>
                    </tr>

                    <tr>
                        <td class="border px-1 py-2 text-left">Maths</td>
                        <td class="border px-1 py-2">100</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->maths }}</td>
                    </tr>
                    <tr>
                        <td class="border px-1 py-2 text-left">Science</td>
                        <td class="border px-1 py-2">100</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->science }}</td>
                    </tr>
                    <tr>
                        <td class="border px-1 py-2 text-left">SST</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->max_marks }}</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->sst }}</td>
                    </tr>
                    <tr>
                        <td class="border px-1 py-2 text-left">Urdu</td>
                        <td class="border px-1 py-2">100</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->urdu }}</td>
                    </tr>
                    <tr>
                        <td class="border px-1 py-2 text-left">Kashmiri</td>
                        <td class="border px-1 py-2">100</td>
                        <td class="border px-1 py-2">{{ $student->marksSheet->kashmiri }}</td>

                    </tr>
                    <tr>
                        <td class="border px-1 py-2 text-left font-bold">Total</td>
                        <td class="border px-1 py-2 font-bold">{{ $student->marksSheet->total_marks }}</td>
                        <td class="border px-1 py-2 font-bold">{{ $student->marksSheet->marks_obtained }}</td>

                    </tr>
                    <tr>
                        <td class="border px-1 py-2 text-left font-bold">Perentage</td>
                        <td class="border px-1 py-2 font-bold">{{ $student->marksSheet->percentage }}%</td>

                    </tr>

                </tbody>
            </table>
            <p class="mt-10 mx-20 my-14 text-xs text-start text-gray-600">Note: This certificate is only valid for pre-matric scholorship form
                submission. </p>
    </div>
    @endforeach
@endsection
