import React, {Dispatch, SetStateAction} from "react";
import {FieldErrors, UseFormRegister, UseFormWatch} from "react-hook-form";
import {AuthFormValues} from "../../../../utils/validation/authSchema";
import styles from "../style.module.scss";

// ICONS
import RevampEcoIcon from '../../../../assets/icons/revamp-eco.svg';
import UploadIcon from '../../../../assets/icons/gallery-export.svg';
import ArrowBackIcon from '../../../../assets/icons/arrow-down-back.svg';

interface Step3Props {
    register: UseFormRegister<AuthFormValues>;
    watch: UseFormWatch<AuthFormValues>;
    isSubmitting: boolean;
    errors: FieldErrors<AuthFormValues>;
    errorMessage: string | null;
    setStep: Dispatch<SetStateAction<number>>
}

const AuthFormStepsStep3: React.FC<Step3Props> = ({
                                                      register,
                                                      watch,
                                                      isSubmitting,
                                                      errors,
                                                      errorMessage,
                                                      setStep
                                                  }) => {
    const combinedErrorMessage = errors.firstName?.message || errors.lastName?.message;

    const singleErrorMessage = combinedErrorMessage || errorMessage;

    const firstName = watch("firstName");
    const lastName = watch("lastName");

    const isButtonDisabled = !firstName || !lastName || !!combinedErrorMessage;

    const onSubmit = () => {
        setStep(4)
    }
    const handleBack = () => {
        setStep(2)
    }
    return (
        <form onSubmit={onSubmit}>
            <div className={styles['logo']}>
                <img src={RevampEcoIcon} alt="logo"/>
            </div>
            <div className={styles['auth-content']}>
                <h3>Создайте профиль</h3>
                <p>У каждого пользователя есть свой профиль, который помогает легче управлять командой.</p>
            </div>
            <div className={styles['inputs-container']}>
                <button className={styles['upload-button']}>
                    <img src={UploadIcon} alt="Upload"/>
                </button>
                <input
                    type="text"
                    {...register("firstName", {
                        required: "Имя обязательно",
                        minLength: {value: 2, message: "Имя должно содержать минимум 2 символа"},
                        pattern: {
                            value: /^[A-Za-zА-Яа-яЁё]+$/,
                            message: "Имя должно содержать только буквы"
                        }
                    })}
                    placeholder="Имя"
                    className={styles['input-field']}
                />
                <input
                    type="text"
                    {...register("lastName", {
                        required: "Фамилия обязательна",
                        minLength: {value: 2, message: "Фамилия должна содержать минимум 2 символа"},
                        pattern: {
                            value: /^[A-Za-zА-Яа-яЁё]+$/,
                            message: "Фамилия должна содержать только буквы"
                        }
                    })}
                    placeholder="Фамилия"
                    className={styles['input-field']}
                />
            </div>
            {singleErrorMessage && <p className={styles['error-message']}>{singleErrorMessage}</p>}
            <div className={styles['last-row']}>
                <button type="button" onClick={handleBack} className={styles['back-button']}>
                    <img src={ArrowBackIcon} alt="Arrow Back"/> Назад
                </button>
                <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={styles['submit-button-type']}
                >
                    {isSubmitting ? <div className="loader"/> : "Войти"}
                </button>
            </div>
        </form>
    );
};

export default AuthFormStepsStep3;