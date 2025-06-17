// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";


// const DisplayPage = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [roll, setRoll] = useState("");
//   const [selected, setSelected] = useState<Student | null>(null);

//   // const [searched, setSearched] = useState(false);

//   useEffect(() => {
//     readExcelFile().then(setStudents);
//   }, []);

//   const handleSearch = () => {
//     const found = students.find((s) => s.rollNum.toString() === roll.trim());
//     setSelected(found || null);
//     // setSearched(true);
//   };

//   //   pdf generation function
//   const contentRef = useRef<HTMLDivElement>(null);
//   const reactToPrintFn = useReactToPrint({ contentRef });

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-3xl mx-auto space-y-4">
//         {/* search area */}
//         <div>
//           <input
//             type="text"
//             placeholder="Enter Roll Number"
//             value={roll}
//             onChange={(e) => setRoll(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md"
//           />
//           <button
//             onClick={handleSearch}
//             className="w-full bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
//           >
//             Search
//           </button>
//         </div>

//         {/* display area */}
//         <div className="" ref={contentRef} style={{ width: "100%" }}>
//           <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 my-3">
//             {/* heading */}
//             {selected && (
//               <div>
//                 <div className="text-center mb-6">
//                   <h1 className="text-2xl font-bold">
//                     Govt Upper Primary School Warpora
//                   </h1>
//                   <p className="text-lg mt-1 font-semibold">Marks Sheet</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mb-6 text-sm sm:text-base">
//                   <p>
//                     <strong>Name:</strong> {selected.name}
//                   </p>
//                   <p>
//                     <strong>Parentage:</strong> {selected.fatherName}
//                   </p>
//                   <p>
//                     <strong>Class:</strong> {selected.prevClass}
//                   </p>
//                   <p>
//                     <strong>Roll No:</strong> {selected.rollNum}
//                   </p>
//                   <p>
//                     <strong>Session:</strong> {selected.prevSession}
//                   </p>
//                 </div>

//                 <table className="w-full text-left border border-gray-300 mb-6">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border px-4 py-2">Subject</th>
//                       <th className="border px-4 py-2">Max Marks</th>
//                       <th className="border px-4 py-2">Marks Obtained</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="border px-4 py-2">English</td>
//                       <td className="border px-4 py-2">100</td>
//                       <td className="border px-4 py-2">{selected.english}</td>
//                     </tr>
//                     <tr>
//                       <td className="border px-4 py-2">Urdu</td>
//                       <td className="border px-4 py-2">100</td>
//                       <td className="border px-4 py-2">{selected.urdu}</td>
//                     </tr>
//                     <tr>
//                       <td className="border px-4 py-2">Math</td>
//                       <td className="border px-4 py-2">100</td>
//                       <td className="border px-4 py-2">{selected.maths}</td>
//                     </tr>
//                     <tr>
//                       <td className="border px-4 py-2">Science</td>
//                       <td className="border px-4 py-2">100</td>
//                       <td className="border px-4 py-2">{selected.science}</td>
//                     </tr>
//                     <tr>
//                       <td className="border px-4 py-2">Social Science</td>
//                       <td className="border px-4 py-2">100</td>
//                       <td className="border px-4 py-2">{selected.socialScience}</td>
//                     </tr>
//                     <tr>
//                       <td className="border px-4 py-2">Kashmiri</td>
//                       <td className="border px-4 py-2">100</td>
//                       <td className="border px-4 py-2">{selected.kashmiri}</td>
//                     </tr>
//                     <tr>
//                       <td className="border px-4 py-2"></td>
//                       <td className="border px-4 py-2 font-bold">Result</td>
//                       <td className="border px-4 py-2 font-bold">Pass</td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <div className="flex justify-between font-semibold">
//                   <p>Max Marks: {selected.maxMarks}</p>
//                   <p>Grand Total: {selected.grandTotal}</p>
//                   <p>Percentage: {selected.percent}%</p>
//                 </div>
//                 <hr className="text-slate-300 mt-3" />
//                 {/* signature section */}
//                 <div className="flex justify-end font-semibold  mt-40 pr-12">
//                   <span className="w-36 h-12   bg-slate-300"> </span>
//                 </div>
//                 <div className="flex justify-between font-semibold px-20">
//                   <p className="">Examination Incharge</p>
//                   <p className="">Headmaster</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Print Button */}
//         {selected && (
//           <div className="text-center">
//             <button
//               onClick={reactToPrintFn}
//               className="px-4 py-2 text-black border-2 rounded-lg border-pink-500 hover:bg-sky-700 hover:text-white transition"
//             >
//               Print
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DisplayPage;
