"use client";

import Link from "next/link";
import styles from "./menuLink.module.css";
import { usePathname } from "next/navigation";

const MenuLink = ({ item }) => {
  const pathname = usePathname();
  const path = pathname
    .split("/")
    .filter((item) => item != "" && item != "dashboard");
  return (
    <Link
      href={item.path}
      className={`${styles.container} ${
        path.includes(item.title?.toLowerCase()) && styles.active
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;
