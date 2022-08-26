{{-- Navbar Starts --}}
<nav class="bg-[#003668] text-white py-4 flex justify-between">
    <ul class="flex space-x-4 pl-4 text-sm md:text-lg ">
        <li><a href="{{ url('/') }}">Home</a> </li>
        <li> <a href="{{ url('/search-student') }}">Search Student</a> </li>
        {{-- <li><a href="{{ url('/add-student') }}">Add Student</a> </li> --}}
    </ul>
    <ul class="flex mx-8 space-x-6 text-sm md:text-lg">
        <li><a href="{{ route('login') }}">Login</a> </li>
        <li><a href="{{  route('register')  }}">Register</a> </li>
    </ul>
</nav>
<!-- Nav Ends -->
