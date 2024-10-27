"use client";
import { addCats } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/category/category.module.css";
import axios from "axios";
import Papa from "papaparse";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
const acceptableCSVFileTypes =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";
const UploadProducts = () => {
  const [state, formAction] = useFormState(addCats, { errors: [] });
  const [errors, setErrors] = useState([]);
  const [category, setCategory] = useState({
    name: "",
    image: "",
  });
  const inputFile = useRef(null);

  useEffect(() => {
    if (state?.errors) {
      setErrors(state?.errors);
    }
  }, [state]);

  const onFileChangeHandler = (event) => {
    const csvFile = event.target.files[0];

    Papa.parse(csvFile, {
      skipEmptyLines: "greedy",
      // header: true,
      complete: function (results) {
        console.log("REsult", results);
        //onUpdateCSVDataHandler(results.data);
      },
    });
  };

  const onButtonClick = (e) => {
    e.stopPropagation();
    inputFile.current.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form} action={formAction}>
          {/* <div className={styles.infoContainer}>
            <div onClick={onButtonClick} className={styles.imgContainer}>
              <Image src={category.image || "/noavatar.png"} alt="" fill />
            </div>
            {"Upload Csv file"}
          </div> */}
          <input
            type="file"
            accept={acceptableCSVFileTypes}
            onChange={onFileChangeHandler}
            //ref={inputFile}
            name="hidden-images"
          />
          <div className={styles.errorMsg}>
            <p style={{ color: "red", fontSize: 10 }}>
              {errors.find((error) => error?.path[0] === "image")?.message}
            </p>
          </div>

          <button>UPLOAD</button>
        </form>
      </div>
    </div>
  );
};

export default UploadProducts;

// "use client";
// import { addCats } from "@/app/lib/actions";
// import styles from "@/app/ui/dashboard/category/category.module.css";
// import axios from "axios";
// import Image from "next/image";
// import { useFormState } from "react-dom";
// import { useEffect, useRef, useState } from "react";
// const AddCategoryPage = () => {
//   const [state, formAction] = useFormState(addCats, { errors: [] });
//   const [errors, setErrors] = useState([]);
//   const [category, setCategory] = useState({
//     name: "",
//     image: "",
//   });
//   const inputFile = useRef(null);

//   useEffect(() => {
//     if (state?.errors) {
//       setErrors(state?.errors);
//     }
//   }, [state]);

//   async function uploadImages(ev) {
//     const files = ev.target?.files;
//     if (files?.length > 0) {
//       const data = new FormData();
//       for (const file of files) {
//         data.append("file", file);
//       }
//       try {
//         const res = await axios.post("/api/upload", data, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         console.log("RESPONSE", res);
//         const newData = res.data?.data || [];
//         setCategory({ ...category, image: newData[0] });
//       } catch (error) {
//         console.log("ERERORRR", error, files);
//       }
//     }
//   }

//   const onButtonClick = (e) => {
//     e.stopPropagation();
//     inputFile.current.click();
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.formContainer}>
//         <form className={styles.form} action={formAction}>
//           <div className={styles.infoContainer}>
//             <div onClick={onButtonClick} className={styles.imgContainer}>
//               <Image src={category.image || "/noavatar.png"} alt="" fill />
//             </div>
//             {category.name}
//           </div>
//           <input
//             type="file"
//             onChange={uploadImages}
//             ref={inputFile}
//             className={styles.hidden}
//             name="hidden-images"
//           />
//           <div className={styles.errorMsg}>
//             <p style={{ color: "red", fontSize: 10 }}>
//               {errors.find((error) => error?.path[0] === "image")?.message}
//             </p>
//           </div>
//           <input type="hidden" name="image" value={category.image} />
//           <label>Name</label>
//           <div className={styles.errorMsg}>
//             <p style={{ color: "red", fontSize: 10 }}>
//               {errors.find((error) => error?.path[0] === "name")?.message}
//             </p>
//           </div>
//           <input
//             type="text"
//             name="name"
//             placeholder={"Enter Cat Name"}
//             value={category?.name}
//             onChange={(e) =>
//               setCategory({ ...category, name: e?.target?.value })
//             }
//           />
//           <button>ADD</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCategoryPage;
