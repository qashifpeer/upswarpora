"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sanity } from "@/lib/sanity";

type ClassType = {
  _id: string;
  title: string;
};

type ResultData = {
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
  dob: string;
  class: { title: string };
  result?: ResultData;
};

const Bonafide2025 = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<StudentWithResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const query = `*[_type == "presentClass"] | order(classId desc){_id, title}`;
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
    dob,
    class->{ title }
  } | order(enrNumber asc)
`;

      try {
        const data: StudentWithResult[] = await sanity.fetch(query, {
          classId: selectedClassId,
        });

        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClassId]);

  const handleBonafideClick = (roll: string) => {
    router.push(`/bonafide?roll=${encodeURIComponent(roll)}`);
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Results - 2024</h1>

      {/* Class Dropdown */}
      <div className="mb-6">
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

      {/* Students Table */}
      {loading ? (
        <p>Loading...</p>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Roll</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">DOB</th>
                <th className="border px-2 py-1">Bonafide</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.enrNumber}>
                  <td className="border px-2 py-1">{stu.enrNumber}</td>
                  <td className="border px-2 py-1">{stu.name}</td>
                  <td className="border px-2 py-1">{stu.dob}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleBonafideClick(stu.enrNumber)}
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
        <p className="text-gray-600">No students found for this class.</p>
      ) : null}
    </div>
  );
};

export default Bonafide2025;
