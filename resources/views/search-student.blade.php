@extends('myLayouts.app')

@section('main')
    <form action="{{ url('/searched-student') }}" method="get" class="md:mx-auto md:w-1/3">
        <div class="m-6">
            <label for="enr_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Search
                With Enrollment Number</label>
            <input type="text" id="enr_number" name="enr_number"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="En Number">

                {{-- error handling --}}
                <div class="ml-2">
            @if (Session::has('error'))
                <div class="text-red-700 text-sm" role="alert">
                    {{ session::get('error') }}
                </div>
            @endif
            @error('enr_number')
                <div class="text-red-700 text-sm">{{ $message }}</div>
            @enderror
        </div>


            <div class="text-center mt-4">
                <button type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
            </div>


        </div>
    </form>
@endsection
