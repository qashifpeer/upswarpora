@extends('myLayouts.app')

@section('main')
    <div class="m-5">
        <div class="bg-gray-200 rounded-lg mx-auto text-center p-6">
            <h1 class="text-blue-900 text-2xl font-bold">Welcome To UPS Warpora</h1>
            <p class="text-red-500 mt-8 text-sm"> This Site is under contruction,Only <span
                    class="font-bold underline">Dowloading Bonafide and Marks sheets</span> are available yet..</p>

        </div>
        <div class="mx-auto text-center p-6">
            <a href="{{ url('/search-student') }}"> <Button
                    class="text-lg font-bold border-2 px-4 py-2 rounded-full outline-4 focus:ring-blue-800 bg-blue-400 hover:bg-blue-800 hover:text-white">Download</Button>
            </a>
        </div>

    </div>
@endsection
