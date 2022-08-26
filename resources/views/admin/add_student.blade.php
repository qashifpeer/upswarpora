@extends('admin.layouts.app')

@section('main')

{{-- md:w-1/3 md:justify-center md:mx-auto  --}}
<div class="border  border-gray-700 ">
    <form action="{{ url('/added-student') }}" method="POST">
        @csrf

        <div class="mx-auto p-5 md:px-36 space-y-2">
            {{-- Enrollment Number --}}
            <div>
                <label for="enr_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enr
                    Number</label>
                <input type="text" id="enr_number" name="enr_number"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enrollment Number">
                @error('enr_number')
                    <div class="text text-danger">{{ $message }}</div>
                @enderror
            </div>

            {{-- Admission Number --}}
            <div>
                <label for="adm_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Adm
                    Number</label>
                <input type="text" id="adm_number" name="adm_number"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Admission Number">
                @error('adm_number')
                    <div class="text text-danger">{{ $message }}</div>
                @enderror
            </div>

            {{-- Name --}}
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Student
                    name</label>
                <input type="text" id="name" name="name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Student Name">
                @error('name')
                    <div class="text text-danger">{{ $message }}</div>
                @enderror
            </div>

            {{-- Father's Name --}}
            <div>
                <label for="father_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Father's
                    name</label>
                <input type="text" id="name" name="father_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Father's Name">
                @error('father_name')
                    <div class="text text-danger">{{ $message }}</div>
                @enderror
            </div>


            {{-- Mother's Name --}}
            <div>
                <label for="mother_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mother's Name</label>
                <input type="text" id="name" name="mother_name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mothers Name">
                @error('mother_name')
                    <div class="text text-danger">{{ $message }}</div>
                @enderror
            </div>

            {{-- Date Of Birth --}}
            <div>
                <label for="dob" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">DOB
                    name</label>
                <input type="date" id="name" name="dob"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="DOB">
                @error('dob')
                    <div class="text text-danger">{{ $message }}</div>
                @enderror
            </div>


            {{-- Class --}}
            <div>
                <label for="class" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select
                    Class</label>
                <select id="class" name="class"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>Select Class</option>
                    <option value="Ist">Ist</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                </select>
            </div>
            {{-- Submit Button --}}
            <div class="text-center">
                <button type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
            </div>

        </div>
    </form>

</div>

@endsection
