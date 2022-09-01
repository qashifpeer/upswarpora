@extends('admin.layouts.app')

@section('main')


<div class="overflow-x-auto relative">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="py-3 px-6">
                    S NO
                </th>
                <th scope="col" class="py-3 px-6">
                    Student Name
                </th>
                <th scope="col" class="py-3 px-6">
                    Class
                </th>
                <th scope="col" class="py-3 px-6">
                   Add Marks
                </th>
                <th scope="col" class="py-3 px-6">
                   Status
                 </th>
            </tr>
        </thead>
        <tbody>
            @foreach ($students as $student )


            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    1
                </th>
                <td class="py-4 px-6">
                   {{ $student->name }}
                </td>
                <td class="py-4 px-6">
                   {{ $student->class }}
                </td>
                <td class="py-4 px-6">
                    <a href="{{ url('/admin/add-marks', $student->enr_number) }}">Add Marks</a>
                </td>
                <td class="py-4 px-6">
                    {{-- {{ $student->marks_status }} --}}
                 </td>
            </tr>
            @endforeach

        </tbody>
    </table>
</div>







</div>

@endsection
