{{-- Navbar Starts --}}
<nav class="bg-[#003668] text-white py-4 flex justify-between md:text-lg md:space-x-5">
    <ul class="flex space-x-2 ml-2  text-xs ">
        <li><a href="{{ url('/dashboard') }}">Home</a> </li>
        <li> <a href="{{ url('search-student') }}">Search Student</a> </li>
        <li><a href="{{ url('/admin/add-student') }}">Add Student</a> </li>
        <li><a href="{{ url('/admin/search-student') }}">Add Marks</a> </li>
        <li><a href="{{ url('/admin/view-student') }}">Show Students</a> </li>
    </ul>
    <ul class="flex  text-xs space-x-3 px-8 ">
        {{-- <li><a href="{{ route('login') }}">Login</a> </li> --}}
        <li>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit">Logout</button>
            </form>
        {{-- <li><a href="{{  route('register')  }}">Register</a> </li> --}}
    </ul>
</nav>
<!-- Nav Ends -->
{{-- --}}
