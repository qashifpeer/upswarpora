"use client";

import { readExcelFile , Student} from "@/lib/readExcel";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { GoMail } from "react-icons/go";
import { FaGlobe } from "react-icons/fa";


// Convert Excel serial date to JS Date
function excelSerialDateToJSDate(serial: number): Date {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + serial * 86400000);
  }
  
  // Format Date to readable string
  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }


const Bonafide = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [roll, setRoll] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  // const [searched, setSearched] = useState(false);

  useEffect(() => {
    readExcelFile().then(setStudents);
  }, []);

  const handleSearch = () => {
    const found = students.find((s) => s.rollNum.toString() === roll.trim());
    setSelected(found || null);
    // setSearched(true);
  };
  //   pdf generation function
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
 
 
  

  const today = formatDate(new Date());
 
  
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

        {/* display area */}
        <div className="" ref={contentRef} style={{ width: "100%" }}>
          <div className="max-w-3xl mx-auto p-6 bg-white  rounded-lg  my-3">
            {/* heading */}
            {selected && (
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold uppercase">
                    office of the headmaster
                  </h1>
                  <h2 className="text-3xl font-bold uppercase">
                    Govt Upper Primary School
                  </h2>
                  <h2 className="text-2xl font-bold uppercase">Warpora</h2>

                  <p className="text-left font-semibold mt-6">UDISE:01011301201</p>
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
                    <strong className="underline">{selected.name}</strong>, S/O,
                    D/O{" "}
                    <strong className="underline">{selected.fatherName}</strong>
                    , resident of <strong className="underline">Warpora</strong>{" "}
                    is currently enrolled in this institution in class{" "}
                    <strong className="underline">
                      {selected.presentClass}
                    </strong>{" "}
                    under Reg. no{" "}
                    <strong className="underline">{selected.pen}</strong> for
                    session{" "}
                    <strong className="underline">{selected.session}</strong>.
                    His/her date of birth is{" "}
                    <strong className="underline">
                      {formatDate(excelSerialDateToJSDate(Number(selected.dob)))}
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
        {selected && (
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
