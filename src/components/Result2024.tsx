"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sanity } from "@/lib/sanity";

type ClassType = {
  _id: string;
  title: string;
};

type ResultType = {
  math: number;
  english: number;
  science: number;
  urdu: number;
  sst: number;
  kashmiri: number;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  finalResult: string;
};

type StudentWithResult = {
  name: string;
  enrNumber: string;
  pen: string;
  class: { title: string };
  result: ResultType | null;
};

const Result2024 = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<StudentWithResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const query = `*[_type == "presentClass"]{_id, title}`;
      const data: ClassType[] = await sanity.fetch(query);
      setClasses(data);
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) return;
      setLoading(true);
      setStudents([]);

      const query = `
        *[_type == "student" && class._ref == $classId]{
          name,
          enrNumber,
          pen,
          class->{ title },
          "result": *[_type == "result2024" && student._ref == ^._id][0]{
            math, english, science, urdu, sst, kashmiri,
            marksObtained, maxMarks, percentage, finalResult
          }
        } | order(enrNumber asc)
      `;

      const data: StudentWithResult[] = await sanity.fetch(query, {
        classId: selectedClassId,
      });

      const studentsWithResult = data.filter((stu) => stu.result !== null);
      setStudents(studentsWithResult);
      setLoading(false);
    };

    fetchStudents();
  }, [selectedClassId]);

  const handleMarksheetClick = (roll: string) => {
    router.push(`/result?roll=${encodeURIComponent(roll)}`);
  };

  return (
    <div className="relative max-w-6xl mx-auto py-10 px-4">
      {/* Watermark Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(156, 163, 175, 0.15) 0,
              rgba(156, 163, 175, 0.15) 1px,
              transparent 1px,
              transparent 100px
            )
          `,
        }}
      >
        <div className="w-full h-full grid grid-cols-3 gap-32 place-items-center rotate-45">
          {Array.from({ length: 30 }).map((_, i) => (
            <p
              key={i}
              className="text-4xl font-bold text-gray-300 whitespace-nowrap"
            >
              UPS Warpora
            </p>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Results - 2024</h1>

        {/* Class Dropdown */}
        <div className="mb-6 max-w-sm mx-auto">
          <label className="block mb-2 font-semibold">Select Class</label>
          <select
            className="w-full border px-4 py-2 rounded-md"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">-- Select a class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.title}
              </option>
            ))}
          </select>
        </div>

        {/* Results Table */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm sm:text-base bg-white shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Roll</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Total</th>
                  <th className="border px-2 py-1">Max</th>
                  <th className="border px-2 py-1">%</th>
                  <th className="border px-2 py-1">Result</th>
                  <th className="border px-2 py-1">Marksheet</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.enrNumber}>
                    <td className="border px-2 py-1">{stu.enrNumber}</td>
                    <td className="border px-2 py-1">{stu.name}</td>
                    <td className="border px-2 py-1">{stu.result?.marksObtained}</td>
                    <td className="border px-2 py-1">{stu.result?.maxMarks}</td>
                    <td className="border px-2 py-1">{stu.result?.percentage}%</td>
                    <td className="border px-2 py-1">{stu.result?.finalResult}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleMarksheetClick(stu.enrNumber)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedClassId ? (
          <p className="text-gray-600 text-center mt-6">
            No students found for this class.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Result2024;
