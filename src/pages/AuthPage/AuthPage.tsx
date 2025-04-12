import AuthForm from "../../components/Forms/AuthForm/AuthForm";
import styles from "./style.module.scss";

const AuthPage = () => {
  return (
    <div className={styles["auth-page"]}>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
