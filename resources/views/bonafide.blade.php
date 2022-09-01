@extends('myLayouts.app')
@section('main')
    <div class="flex justify-center">
        <div class="border-4 border-gray-700 m-2 p-2 sm:m-4 sm:p-4 lg:w-1/2">
            <div class="border-4 border-gray-700 m-2 p-2 flex flex-col text-center sm:m-4 sm:p-4">
                {{-- Heading --}}
                <h2 class="capitalize text-xl md:text-4xl">deptt. of education</h2>
                <h1 class="font-bold text-lg capitalize md:text-4xl">office of the headmaster </h1>
                <h2 class="capitalize text-xl md:text-4xl">govt ups warpora</h2>
                <h3 class="uppercase underline text-[10px] font-bold mt-4 md:text-sm">bonafide certificate</h3>

                {{-- date --}}
                <p class="text-start text-xs underline text-gray-600">{{ date('d-m-Y') }}</p>
               {{-- certificate --}}
                @foreach ($data as $student)
                    <p class="mt-4 text-sm tracking-widest  md:text-lg "> It is certified that <span
                            class="underline font-bold uppercase">{{ $student->name }}</span> , parentage <span
                            class="underline font-bold uppercase">{{ $student->father_name }}</span> residant of <span
                            class="font-bold underline">WARPORA</span> , who is enrolled in this institution under adm no
                        <span class="font-bold underline uppercase">{{ $student->adm_number }}</span> and is reading in
                        class <span class="font-bold underline">{{ $student->class }}</span> for the accademic year <span
                            class="font-bold underline">2022</span>
                    </p>
                    <div class="mt-10 text-center ml-auto">
                        <p class="text-xs font-bold ">Headmaster</p>
                        <p class="text-xs font-bold">Govt. Upper Primary School </p>
                        <p class="text-xs font-bold">Warpora</p>
                    </div>
                    <p class="mt-10 text-xs text-start text-gray-600">Note: This certificate is only valid for pre-matric scholorship form
                        submission. </p>
            </div>
            @endforeach
        </div>
    </div>
    </div>
@endsection
