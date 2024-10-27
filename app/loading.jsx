"use client";
import styles from "@/app/ui/dashboard/dashboard.module.css";
import Image from "next/image";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className={styles.Loading}>
      <Image src={"/spinner.gif"} width={100} alt="loading" height={100} unoptimized />
    </div>
  );
}
