@extends('myLayouts.app')

@section('main')
<div>
    <p class="text-2xl m-2 ">MDM Register of Govt <span class="font-bold underline capitalize">{{ $school }}</span></p>
    <p class="m-2">Daily Mid Day Meals Ragister for the month <span class="font-bold underline capitalize">{{ $month }}</span></p>
</div>
{{-- display table --}}
<div>
    <table class="w-full border">
        <thead>
            <tr class="bg-gray-50 border-b">
                <th class="p-2 border-r text-xs">S.NO</th>
                <th class="p-2 border-r text-xs">Date</th>
                <th class="p-2 border-r text-xs">No. Of Meals Served-Primary</th>
                <th class="p-2 border-r text-xs">No. Of Meals Served-Middle</th>
                <th class="p-2 border-r text-xs">Rice Utilized</th>
                <th class="p-2 border-r text-xs">Total Expenditure</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>01-DAy</td>
                <td>01-DAy</td>
            </tr>
        </tbody>
    </table>

</div>

@endsection
