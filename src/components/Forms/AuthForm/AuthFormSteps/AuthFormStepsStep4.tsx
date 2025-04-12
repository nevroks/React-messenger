import React, { Dispatch, SetStateAction, useState } from "react";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue
} from "react-hook-form";
import { AuthFormValues } from "../../../../utils/validation/authSchema";
import styles from "../style.module.scss";

// ICONS
import RevampEcoIcon from "../../../../assets/icons/revamp-eco.svg";
import ArrowBackIcon from "../../../../assets/icons/arrow-down-back.svg";
import { useMutation } from "@tanstack/react-query";
import { setRequiredData } from "../../../../utils/services/tokenRest.service.ts";
import { useUserDataStore } from "../../../../stores/UserDataStore";
import { JWTTokenType } from "../../../../utils/types";

interface Step4Props {
  register: UseFormRegister<AuthFormValues>;
  handleSubmit: (
    onSubmit: SubmitHandler<AuthFormValues>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  watch: UseFormWatch<AuthFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<AuthFormValues>;
  errorMessage: string | null;
  setStep: Dispatch<SetStateAction<number>>;
  handleAuthSuccess: (JWT: JWTTokenType) => void;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  setValue: UseFormSetValue<AuthFormValues>;
}
type organizationChoiceType="join" | "create"
const AuthFormStepsStep4: React.FC<Step4Props> = ({
  register,
  handleSubmit,
  watch,
  isSubmitting,
  errors,
  errorMessage,
  setStep,
  handleAuthSuccess,
  setErrorMessage,
  setValue
}) => {
  const { actions } = useUserDataStore();
  const [organizationChoice, setOrganizationChoice] = useState<organizationChoiceType>("join");

  const companyCode = watch("companyCode");
  const companyName = watch("companyName");

  const isButtonDisabled =
    (organizationChoice === "join" && !companyCode) ||
    (organizationChoice === "create" && !companyName);

  const combinedErrorMessage =
    errors.companyCode?.message || errors.companyName?.message || errorMessage;

  const setRequiredDataMutation = useMutation({
    mutationFn: (data: AuthFormValues) =>
      setRequiredData({
        email: data.email,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        companyCode: data.companyCode || undefined,
        companyName: data.companyName || undefined,
        otp: Number(data.otp),
      }),
    onSuccess: (response, data: AuthFormValues) => {
      handleAuthSuccess(response.data);
      actions.setUserDataAction(data.email, "email");
      if (data.firstName !== undefined && data.lastName !== undefined) {
        actions.setUserDataAction(data.firstName, "firstName");
        actions.setUserDataAction(data.lastName, "lastName");
      }
    },
    onError: () => setErrorMessage("Не удалось завершить регистрацию."),
  });

  const handleBack = () => {
    setStep(3);
  };

  const onSubmit = (data: AuthFormValues) => {
    if (organizationChoice === "create") {
      setRequiredDataMutation.mutate({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        otp:data.otp
      });
    }else{
      setRequiredDataMutation.mutate({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        companyCode: data.companyCode,
        otp:data.otp
      });
    }

  };

  const handleChoice = (choice: organizationChoiceType) => {
    setOrganizationChoice(choice);
    if (choice === "create") {
      setValue("companyCode", "");
    } else {
      setValue("companyName", "");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles["logo"]}>
        <img src={RevampEcoIcon} alt="logo" />
      </div>
      <div className={styles["auth-content"]}>
        <h3>Привяжите организацию</h3>
        <p>У каждого пользователя должна быть как минимум одна компания</p>
      </div>
      <div className={styles["button-wrapper"]}>
        <button
          type="button"
          className={`${styles["choice-button"]} ${organizationChoice === "join" ? styles["active"] : ""
            }`}
          onClick={() => handleChoice("join")}
        >
          Вступить в организацию
        </button>
        <button
          type="button"
          className={`${styles["choice-button"]} ${organizationChoice === "create" ? styles["active"] : ""
            }`}
          onClick={() => handleChoice("create")}
        >
          Создать организацию
        </button>
      </div>

      {organizationChoice === "join" && (
        <input
          type="text"
          {...register("companyCode", { required: "Код компании обязателен" })}
          placeholder="Код компании"
          className={styles["input-field-comp"]}
        />
      )}
      {organizationChoice === "create" && (
        <input
          type="text"
          {...register("companyName", {
            required: "Название компании обязательно",
          })}
          placeholder="Название компании"
          className={styles["input-field-comp"]}
        />
      )}

      {combinedErrorMessage && (
        <p className={styles["error-message"]}>{combinedErrorMessage}</p>
      )}

      <div className={styles["last-row"]}>
        <button
          type="button"
          onClick={handleBack}
          className={styles["back-button"]}
        >
          <img src={ArrowBackIcon} alt="Arrow Back" /> Назад
        </button>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={styles["submit-button-type"]}
        >
          {isSubmitting ? <div className="loader" /> : "Войти"}
        </button>
      </div>
    </form>
  );
};

export default AuthFormStepsStep4;
