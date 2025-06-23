"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { sanity } from "@/lib/sanity";
import QRCode from "react-qr-code";
import { GoMail } from "react-icons/go";
import { FaGlobe } from "react-icons/fa";

type StudentType = {
  name: string;
  fatherName: string;
  dob: string;
  enrNumber: string;
  penNumber: string;
  class: { title: string };
  session: { title: string };
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Bonafide = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRoll = searchParams.get("roll") || "";
  const [roll, setRoll] = useState(initialRoll);
  const [student, setStudent] = useState<StudentType | null>(null);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });
  const today = formatDate(new Date().toISOString());

  useEffect(() => {
    if (initialRoll) {
      fetchStudentData(initialRoll);
    }
  }, [initialRoll]);

  const fetchStudentData = async (rollNumber: string) => {
    setError("");
    setStudent(null);
    try {
      const query = `*[_type == "student" && enrNumber == $enrNumber][0]{
        name,
        fatherName,
        enrNumber,
        penNumber,
        dob,
        class->{
          title
        },
        session->{
          title
        }
      }`;

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

  const handleSearch = () => {
    if (roll.trim()) {
      router.push(`/bonafide?roll=${encodeURIComponent(roll.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Box */}
        <div>
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white mt-2 px-4 py-2 rounded-md"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* Certificate Content with Watermark */}
        {student && (
          <div
            ref={contentRef}
            className="bg-white p-6 rounded-lg shadow overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
                  <text x='0' y='150' transform='rotate(-45 100 100)' 
                    fill='rgba(0,0,0,0.05)' font-size='28' font-family='Arial'>
                    UPS Warpora
                  </text>
                </svg>
              `)}")`,
              backgroundRepeat: "repeat",
              backgroundPosition: "0 0",
            }}
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold uppercase dancing">
                office of the headmaster
              </h1>
              <h2 className="text-3xl font-bold uppercase">
                Govt Upper Primary School
              </h2>
              <h2 className="text-2xl font-bold uppercase">Warpora</h2>

              <p className="text-left font-semibold mt-6">
                UDISE: 01011301201
              </p>
              <div className="flex justify-between">
                <p>
                  <GoMail className="inline" /> upswarpora@gmail.com
                </p>
                <p>
                  <FaGlobe className="inline" /> https://www.upswarpora.vercel.app
                </p>
              </div>
              <hr className="my-4" />

              <p className="text-xl  underline my-10 uppercase ubuntu-bold">
                Bonafide Certificate
              </p>

              <p className="text-lg leading-7 mb-8 text-justify ubuntu-regular">
                It is certified that{" "}
                <strong className="underline">{student.name}</strong>, S/O, D/O{" "}
                <strong className="underline">{student.fatherName}</strong>,
                resident of <strong className="underline">Warpora</strong> is
                currently enrolled in this institution in class{" "}
                <strong className="underline">{student.class.title}</strong>{" "}
                under Reg. no{" "}
                <strong className="underline">{student.penNumber}</strong> for
                session{" "}
                <strong className="underline">{student.session.title}</strong>.
                His/her date of birth is{" "}
                <strong className="underline">{formatDate(student.dob)}</strong>.
                Hence, this bonafide certificate is issued in his/her favour.
              </p>
              <div className="flex justify-end">
                <p className="text-sm font-semibold">Date of Issue: {today}</p>
              </div>
            </div>

            <div className="flex justify-end font-semibold mt-40 pr-12">
              <span className="w-36 h-12 bg-slate-300"></span>
            </div>
            <div className="flex justify-end font-semibold px-20">
              <p className="">Headmaster</p>
            </div>

            {/* QR Code */}
            <div className="mt-6 text-center">
              <p className="font-medium mb-1">Scan to verify:</p>
              <QRCode
                value={`https://upswarpora.vercel.app/bonafide?roll=${student.enrNumber}`}
                size={128}
              />
            </div>
          </div>
        )}

        {/* Print Button */}
        {student && (
          <div className="text-center">
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

export default Bonafide;
