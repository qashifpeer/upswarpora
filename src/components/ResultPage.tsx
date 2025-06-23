"use client";
import { sanity } from "@/lib/sanity";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from 'react-qr-code';

type ResultType = {
  math: number;
  science: number;
  english: number;
  urdu: number;
  sst: number;
  kashmiri: number;
  total: number;
  marksObtained: number;
  percentage: number;
  maxMarks: number;
 class: { title: string };
  session: { title: string };
};

type StudentType = {
  name: string;
  fatherName: string;
  dob: string;
  enrNumber: string;
  result: ResultType | null;
  
};

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoll = searchParams.get("roll") || "";
  const [roll, setRoll] = useState(initialRoll);
  const [student, setStudent] = useState<StudentType | null>(null);
  const [error, setError] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchStudentData = async (rollNumber: string) => {
    setError("");
    setStudent(null);

    try {
      const query = `
        *[_type == "student" && enrNumber == $enrNumber][0]{
          name,
          fatherName,
          dob,
          enrNumber,
          "result": *[_type == "result2024" && student._ref == ^._id][0]{
          class->{ title },
          session->{ title },
            math,
            science,
            english,
            urdu,
            sst,
            kashmiri,
            marksObtained,
            maxMarks,
            percentage,
            finalResult
          }
        }
      `;
      const data = await sanity.fetch(query, { enrNumber: rollNumber.trim() });
      if (data) {
        setStudent(data);
      } else {
        setError("No student found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data.");
    }
  };

  // Load student from URL on mount
  useEffect(() => {
    if (initialRoll) fetchStudentData(initialRoll);
  }, [initialRoll]);

  const handleSearch = () => {
    if (roll.trim()) {
      router.push(`/result?roll=${encodeURIComponent(roll.trim())}`);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* Marksheet */}
        {student && (
          <div ref={contentRef}>
            <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200 mt-6"
             style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
                  <text x='0' y='150' transform='rotate(-45 100 100)' 
                    fill='rgba(0,0,0,0.05)' font-size='28' font-family='Arial'>
                    UPS WARPORA
                  </text>
                </svg>
              `)}")`,
              backgroundRepeat: "repeat",
              backgroundPosition: "0 0",
            }}>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">
                  Govt Upper Primary School Warpora
                </h1>
                <p className="text-lg font-semibold mt-1">Marks Sheet</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm sm:text-base">
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Parentage:</strong> {student.fatherName}
                </p>
                <p>
                  <strong>Class:</strong> {student.result?.class.title}
                </p>
                <p>
                  <strong>Roll No:</strong> {student.enrNumber}
                </p>
                <p>
                  <strong>Session:</strong> {student.result?.session.title}
                </p>
              </div>

              <table className="w-full text-left border border-gray-300 mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Subject</th>
                    <th className="border px-4 py-2">Max Marks</th>
                    <th className="border px-4 py-2">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "english",
                    "urdu",
                    "math",
                    "science",
                    "sst",
                    "kashmiri",
                    
                  ].map((subject) => (
                    <tr key={subject}>
                      <td className="border px-4 py-2 capitalize">{subject}</td>
                      <td className="border px-4 py-2">100</td>
                      <td className="border px-4 py-2">
                        {/* {(student.result as any)?.[subject]} */}
                        {/* {student.result?.[subject as keyof ResultType]} */}
                           {String(student.result?.[subject as keyof ResultType] ?? "")} {/* changed */}

                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2 font-bold">Result</td>
                    <td className="border px-4 py-2 font-bold">Pass</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between font-semibold">
                <p>Max Marks: {student.result?.maxMarks}</p>
                <p>Grand Total: {student.result?.marksObtained}</p>
                <p>Percentage: {student.result?.percentage}%</p>
              </div>

              {/* Signature */}
              <hr className="text-slate-300 mt-3" />
              <div className="flex justify-end mt-32 pr-12">
                <span className="w-36 h-12 bg-slate-300" />
              </div>
              <div className="flex justify-between font-semibold px-20 mt-1">
                <p>Examination Incharge</p>
                <p>Headmaster</p>
              </div>

              {/* QR Code */}
              <div className="mt-6 text-center">
                <p className="font-medium mb-1">Scan to verify:</p>
                {student && (
                  <QRCode
                    value={`http://upswarpora.vercel.app/result?roll=${student.enrNumber}`}
                    size={128}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Print Button */}
        {student && (
          <div className="text-center mt-4">
            <button
              onClick={reactToPrintFn}
              className="px-4 py-2 text-black border-2 rounded-lg border-pink-500 hover:bg-sky-700 hover:text-white transition"
            >
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
