// "use client";

// import useEmblaCarousel from "embla-carousel-react";
// import { useEffect, useCallback } from "react";

// const slides = [
//   {
//     title: "School Campus",
//     image:
//       "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1400&auto=format&fit=crop",
//   },
//   {
//     title: "Classroom Learning",
//     image:
//       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop",
//   },
//   {
//     title: "Student Activities",
//     image:
//       "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1400&auto=format&fit=crop",
//   },
// ];

// export default function ImageSlider() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

//   const autoScroll = useCallback(() => {
//     if (!emblaApi) return;
//     emblaApi.scrollNext();
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     const interval = setInterval(autoScroll, 3500);
//     return () => clearInterval(interval);
//   }, [emblaApi, autoScroll]);

//   return (
//     <section id="gallery" className="bg-slate-50 py-16">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="mb-8 text-center">
//           <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
//             Gallery
//           </p>
//           <h2 className="mt-2 text-3xl font-bold text-slate-900">
//             School Moments
//           </h2>
//         </div>

//         <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
//           <div className="flex">
//             {slides.map((slide, index) => (
//               <div
//                 key={index}
//                 className="relative min-w-0 flex-[0_0_100%] overflow-hidden"
//               >
//                 <div
//                   className="flex h-[260px] items-end bg-slate-800 sm:h-[380px] lg:h-[500px]"
//                   style={{
//                     backgroundImage: `url('${slide.image}')`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                   }}
//                 >
//                   <div className="w-full bg-gradient-to-t from-slate-950/80 to-transparent p-6 sm:p-8">
//                     <h3 className="text-xl font-semibold text-white sm:text-2xl">
//                       {slide.title}
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }