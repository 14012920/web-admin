import { addUser } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/users/users.module.css";

const AddUserPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.formContainer}>
          <form action={addUser} className={styles.form}>
            <label>Email</label>
            <input type="text" name="email" placeholder={"email"} />
            <label>Password</label>
            <input type="password" name="password" placeholder={"password"} />
            <label>Is Admin?</label>
            <select name="isAdmin" id="isAdmin">
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
            <button>Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
