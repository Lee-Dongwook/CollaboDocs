"use client";

import { useState, useEffect } from "react";
import type { PaymentType } from "@/types/paymentType";
import { columns } from "@/components/ui/column";
import { DataTable } from "@/components/ui/DataTable";

async function getData(): Promise<PaymentType[]> {
  const res = await fetch(
    "https://my.api.mockaroo.com/payment_info.json?key=f0933e60"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function DocumentTable() {
  const [paymentData, setPaymentData] = useState<PaymentType[]>([]);
  useEffect(() => {
    const data = async () => {
      const result = await getData();
      setPaymentData(result);
    };
    data();
  }, []);
  return <DataTable columns={columns} data={paymentData} />;
}
