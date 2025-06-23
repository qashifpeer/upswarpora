import { Bonafide } from "@/components";
import { Suspense } from "react";
import React from "react";

const BonafidePage = () => {
  return (
    <div>
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Bonafide />
      </Suspense>
    </div>
  );
};

export default BonafidePage;
