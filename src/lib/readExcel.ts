
import * as XLSX from "xlsx";

export type Student = {
  name: string;
  parentage: string;
  presentClass: string;
  prevClass: string;
  pen: string;
  rollNum: string;
  prevSession: string;
  session: string;
  english: number;
  urdu: number;
  maths: number;
  science: number;
  kashmiri: number;
  socialScience: number;
  grandTotal: number;
  maxMarks : number;
  percent: number;
  dob: string;
  fatherName: string;
  currentDate : string;
};



export const readExcelFile = async (): Promise<Student[]> => {
  const res = await fetch("/master-data.xlsx");
  const arrayBuffer = await res.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: Student[] = XLSX.utils.sheet_to_json(sheet);

  return data;
};
