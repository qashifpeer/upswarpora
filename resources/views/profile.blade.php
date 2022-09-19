@extends('myLayouts.app')
@section('main')
    <div class="flex items-center justify-center">

        <div class="bg-white  rounded-lg md:w-1/2">

            <div class="flex flex-col items-center justify-center pt-10">
                <div class="flex flex-col relative mb-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#5000ca" fill-opacity="1"
                            d="M0,64L60,96C120,128,240,192,360,213.3C480,235,600,213,720,197.3C840,181,960,171,1080,186.7C1200,203,1320,245,1380,266.7L1440,288L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z">
                        </path>
                    </svg>
                    <img src="{{ asset('img/me.jpg') }}" alt=""
                        class="w-24 h-24 absolute rounded-full top-10 shadow-xl left-20">
                </div>
                <h1 class="font-medium pt-3">Qashif Peer</h1>
                <h2 class="text-sm font-thin">Teacher | Web Developer</h2>
                <h1 class="py-1 pt-4 underline font-mono text-sm">About</h1>
                <p class="px-6 py-4 text-sm text-gray-600 bg-gray-100 mx-4 rounded-lg shadow-lg">Teacher in J&K School
                    Education Deptt. Schooling from JNV Putshai and BCA from GDC Baramulla. Apart from teaching I spend my
                    time in coding stuff. </p>


                <div>
                    <h1 class="px-6 pb-2 mt-8 text-sm underline font-mono">Skill Set</h1>
                </div>
                <div class="flex flex-wrap space-x-2 px-4 space-y-2 md:pb-6">
                    <div class=""></div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">laravel</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">php</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">html5</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">css</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">tailwind-css</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">bootstrap5</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">vueJS</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">javascript</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full">mysql</div>
                    <div class="bg-green-100 text-sm px-2 py-0 rounded-full ">git</div>
                </div>
            </div>
        </div>
    </div>
@endsection
