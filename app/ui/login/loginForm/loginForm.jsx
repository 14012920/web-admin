"use client";

import { authenticate } from "@/app/lib/actions";
import styles from "./loginForm.module.css";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";

const LoginForm = () => {
  const [state, formAction] = useFormState(authenticate, { errors: [] });
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    if (state?.errors) {
      setErrors(state?.errors);
    }
  }, [state]);
  return (
    <form action={formAction} className={styles.form}>
      <Image src={"/icon2.webp"} alt="" width="80" height="50" />
      <h1>Login</h1>
      <input type="text" placeholder="email" name="email" />
      <div className={styles.errorMsg}>
        <p style={{ color: "red", fontSize: 10 }}>
          {errors.find((error) => error?.path[0] === "email")?.message}
        </p>
      </div>
      <input type="password" placeholder="password" name="password" />
      <div className={styles.errorMsg}>
        <p style={{ color: "red", fontSize: 10 }}>
          {errors.find((error) => error?.path[0] === "password")?.message}
        </p>
      </div>
      <button>Login</button>
      {typeof state === "string" && (
        <p style={{ color: "red", fontSize: 10 }}>{state}</p>
      )}
    </form>
  );
};

export default LoginForm;
