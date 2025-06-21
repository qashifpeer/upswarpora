"use client";
import { sanity } from "@/lib/sanity";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { GoMail } from "react-icons/go";
import { FaGlobe } from "react-icons/fa";

type StudentType = {
  name: string;
  fatherName: string;
  dob: string;
  enrNumber: string;
  class: { title: string };
  session: { title: string };
};

// Format Date to readable string
function formatDate(dateString: string): string {
   const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Bonafide = () => {
  const [roll, setRoll] = useState("");
  const [student, setStudent] = useState<StudentType | null>(null);
    const [error, setError] = useState("");


 const handleSearch = async () => {
    setError("");
    setStudent(null);
    try {
      const query = `*[_type == "student" && enrNumber == $enrNumber][0]{
        name,
       fatherName,
       enrNumber,
       dob,
       class,
       session->{
       title
       },
       class->{
       title
       },
        
      }`;

      const data = await sanity.fetch(query, { enrNumber: roll.trim() });
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


  
  //   pdf generation function
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const today = formatDate(new Date().toISOString()); // if formatDate only accepts string


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* search area */}
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
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Search
          </button>
        </div>
         {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* display area */}
        <div className="" ref={contentRef} style={{ width: "100%" }}>
          <div className="max-w-3xl mx-auto p-6 bg-white  rounded-lg  my-3">
            {/* heading */}
            {student && (
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold uppercase">
                    office of the headmaster
                  </h1>
                  <h2 className="text-3xl font-bold uppercase">
                    Govt Upper Primary School
                  </h2>
                  <h2 className="text-2xl font-bold uppercase">Warpora</h2>

                  <p className="text-left font-semibold mt-6">
                    UDISE:01011301201
                  </p>
                  <div className="flex justify-between">
                    <p className="text-left">
                      <GoMail className="inline" /> upswarpora@gmail.com
                    </p>
                    <p className="text-left">
                      <FaGlobe className="inline" />{" "}
                      https://www.upswarpora.vercel.app
                    </p>
                  </div>
                  <hr />
                  <p className="text-lg font-semibold underline my-10">
                    Bonafide Certificate
                  </p>
                  <p className="text-lg justify-between leading-7 mb-8">
                    It is certified that{" "}
                    <strong className="underline">{student.name}</strong>, S/O,
                    D/O
                    <strong className="underline">{student.fatherName}</strong>
                    , resident of <strong className="underline">Warpora</strong>{" "}
                    is currently enrolled in this institution in class{" "}
                    <strong className="underline">
                      {student.class.title}
                    </strong>{" "}
                    under Reg. no{" "}
                    <strong className="underline">{student.enrNumber}</strong>{" "}
                    for session{" "}
                    <strong className="underline">
                      {student.session.title}
                    </strong>
                    . His/her date of birth is{" "}
                    <strong className="underline">
                      {student?.dob && (
                        <>
                          {formatDate(student.dob)}
                        </>
                      )}
                    </strong>
                    . Hence, this bonafide certificate is issued in his/her
                    favour.
                  </p>

                  <div className="flex justify-end">
                    <p className="text-sm font-semibold">
                      Date of Issue: {today}
                    </p>
                  </div>
                </div>

                {/* signature section */}
                <div className="flex justify-end font-semibold  mt-40 pr-12">
                  <span className="w-36 h-12   bg-slate-300"> </span>
                </div>
                <div className="flex justify-end font-semibold px-20">
                  <p className="">Headmaster</p>
                </div>
              </div>
            )}
          </div>
        </div>
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
