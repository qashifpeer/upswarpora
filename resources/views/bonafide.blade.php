@extends('myLayouts.app')
@section('main')


<div class="flex justify-center">
<div class="border-4 border-gray-700 m-2 p-2 md:m-4 md:p-4 md:w-1/2">
    <div class="border-4 border-gray-700 m-2 p-2 flex flex-col text-center md:m-4 md:p-4">
        <h2 class="capitalize text-xl md:text-4xl">deptt. of education</h2>
        <h1 class="font-bold text-lg capitalize md:text-4xl">office of the headmaster </h1>
        <h2 class="capitalize text-xl md:text-4xl">govt ups warpora</h2>
        <h3 class="uppercase underline text-[10px] font-bold mt-4 md:text-sm">bonafide certificate</h3>
        @foreach ($data as $student )


        <p class="mt-4 text-sm md:text-lg">     It is certified that <span class="underline font-bold">{{ $student->name }}</span> , parentage <span class="underline font-bold">{{ $student->father_name }}</span> residant of <span class="font-bold underline">warpora</span>   , who is enrolled in this institution under adm no  <span class="font-bold underline">{{ $student->adm_number }}</span> and is reading in class  <span class="font-bold underline">{{ $student->class }}</span> </p>@endforeach
    </div>
</div>
</div>


@endsection
