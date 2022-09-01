@extends('admin.layouts.app')

@section('main')
    {{-- md:w-1/3 md:justify-center md:mx-auto --}}
    <div class="border  border-gray-700 ">

        <form action="{{ url('/admin/added-marks') }}" method="POST">
            @csrf



            <div class="mx-auto p-5 md:px-36 space-y-2">
                {{-- Enrollment Number --}}



                <div>
                    {{-- fetching Enrollment from Student Table --}}
                    @foreach ($data as $student)
                        <label for="enr_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enr
                            Number</label>
                        <input type="number" readonly id="enr_number" name="enr_number" value="{{ $student->enr_number }}"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        @error('enr_number')
                            <div class="text text-danger">{{ $message }}</div>
                        @enderror

                </div>

                <div>
                    {{-- fetching Class from Student Table --}}

                        <label for="class" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Class
                            </label>
                        <input type="text" readonly id="class" name="class" value="{{ $student->class }}"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        @error('class')
                            <div class="text text-danger">{{ $message }}</div>
                        @enderror

                </div>

                {{-- Maths --}}
                <div>
                    <label for="maths"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Maths</label>
                    <input type="number" id="maths" name="maths"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Maths">
                    @error('maths')
                        <div class="text text-danger">{{ $message }}</div>
                    @enderror
                </div>

                {{-- English --}}
                <div>
                    <label for="english"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">English</label>
                    <input type="number" id="english" name="english"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Englisg">
                    @error('english')
                        <div class="text text-danger">{{ $message }}</div>
                    @enderror
                </div>

                {{-- Science --}}
                <div>
                    <label for="science"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">science</label>
                    <input type="number" id="science" name="science"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="science">
                    @error('science')
                        <div class="text text-danger">{{ $message }}</div>
                    @enderror
                </div>

                {{-- SST --}}
                <div>
                    <label for="sst"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">sst</label>
                    <input type="number" id="sst" name="sst"


                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="sst">
                    @error('sst')
                        <div class="text text-danger">{{ $message }}</div>
                    @enderror
                </div>
                @endforeach

                {{-- Urdu --}}
                <div>
                    <label for="urdu"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">urdu</label>
                    <input type="number" id="urdu" name="urdu"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="urdu">
                    @error('urdu')
                        <div class="text text-danger">{{ $message }}</div>
                    @enderror
                </div>

                {{-- Kashmiri --}}
                <div>
                    <label for="kashmiri"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">kashmiri</label>
                    <input type="number" id="kashmiri" name="kashmiri"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="kashmiri">
                    @error('kashmiri')
                        <div class="text text-danger">{{ $message }}</div>
                    @enderror
                </div>

                {{-- Submit Button --}}
                <div class="text-center">
                    <button type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                </div>

            </div>
        </form>

    </div>
    @if (Session::has('error'))
    <div class="text-red-700 text-sm" role="alert">
        {{ session::get('error') }}
    </div>
@endif
@endsection
