"use client";
import React, { Suspense } from "react";

import { ResultPage } from '@/components'
// app/result/page.tsx


const Result = () => {
  return (
   <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <ResultPage />
      {/* <Result2024 /> */}
    </Suspense>
  )
}

export default Result