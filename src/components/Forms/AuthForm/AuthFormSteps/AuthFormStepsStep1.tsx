import React, {Dispatch, SetStateAction} from "react";
import {SubmitHandler, UseFormRegister} from "react-hook-form";
import {AuthFormValues} from "../../../../utils/validation/authSchema";
import styles from "../style.module.scss";
import RevampEcoIcon from '../../../../assets/icons/revamp-eco.svg';
import SmsIcon from '../../../../assets/icons/sms.svg';
import {useMutation} from "@tanstack/react-query";
import {createJwtToken} from "../../../../utils/services/tokenRest.service.ts";

interface Step1Props {
    register: UseFormRegister<AuthFormValues>;
    handleSubmit: (onSubmit: SubmitHandler<AuthFormValues>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    isValid: boolean;
    errorMessage: string | null;
    isButtonLoading: boolean;
    setIsButtonLoading: Dispatch<SetStateAction<boolean>>;
    setErrorMessage: Dispatch<SetStateAction<string | null>>;
    setStep: Dispatch<SetStateAction<number>>;
}

const AuthFormStepsStep1: React.FC<Step1Props> = ({
                                                      register,
                                                      handleSubmit,
                                                      isValid,
                                                      errorMessage,
                                                      isButtonLoading,
                                                      setIsButtonLoading,
                                                      setErrorMessage,
                                                      setStep
                                                  }) => {

    const requestOtpMutation = useMutation({
        mutationFn: createJwtToken,
        onSuccess: () => {
            setStep(2);
            setIsButtonLoading(false);
        },
        onError: () => {
            setErrorMessage("Не удалось отправить код. Попробуйте снова.");
            setIsButtonLoading(false);
        },
    });
    const onSubmit = (data: AuthFormValues) => {
        setIsButtonLoading(true);
        requestOtpMutation.mutate(data.email);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['logo']}>
                <img src={RevampEcoIcon} alt="logo"/>
            </div>
            <div className={styles['auth-content']}>
                <h3>Ваша электронная почта</h3>
                <p>Чтобы присоединиться к Ревамп.Эко, введите свою электронную почту:</p>
            </div>
            <div className={styles['input-wrapper']}>
                <img src={SmsIcon} alt="sms icon"/>
                <input
                    type="email"
                    {...register("email", {required: true})}
                    placeholder="Электронная почта"
                    className={styles['email-input']}
                />
            </div>
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
            <button type="submit" disabled={!isValid || isButtonLoading} className={styles['submit-button']}>
                {isButtonLoading ? <div className="loader"/> : "Продолжить"}
            </button>
            <div className={styles['terms-content']}>
                <p>
                    Нажимая "Продолжить", вы принимаете условия
                    <span>политики конфиденциальности</span> и <span>публичной оферты</span>
                </p>
            </div>
            <div className={styles['support-content']}>
                <p>Написать в поддержку</p>
            </div>
        </form>
    )
};


export default AuthFormStepsStep1;