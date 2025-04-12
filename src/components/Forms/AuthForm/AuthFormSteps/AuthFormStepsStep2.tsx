import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {FieldErrors, SubmitHandler, UseFormGetValues, UseFormSetValue} from "react-hook-form";
import {AuthFormValues} from "../../../../utils/validation/authSchema";
import styles from "../style.module.scss";
import classNames from "classnames";

// ICONS
import ArrowBackIcon from '../../../../assets/icons/arrow-down-back.svg';
import RevampEcoIcon from '../../../../assets/icons/revamp-eco.svg';
import {useMutation} from "@tanstack/react-query";
import {validateOtp} from "../../../../utils/services/tokenRest.service.ts";
import {formattedTimer} from "../../../../utils/helpers/formattedTimer.ts";
import {AxiosError} from "axios";
import {JWTTokenType, ValidationErrorResponse} from "../../../../utils/types";
import { useUserDataStore } from "../../../../stores/UserDataStore/index.ts";


interface Step2Props {
    errors: FieldErrors<AuthFormValues>;
    errorMessage: string | null;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    setErrorMessage: Dispatch<SetStateAction<string | null>>;
    setIsButtonLoading: Dispatch<SetStateAction<boolean>>;
    getValues: UseFormGetValues<AuthFormValues>;
    handleSubmit: (onSubmit: SubmitHandler<AuthFormValues>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    handleAuthSuccess: (JWT: JWTTokenType) => void;
    setValue:UseFormSetValue<AuthFormValues>
}

const AuthFormStepsStep2: React.FC<Step2Props> = ({
                                                      errors,
                                                      errorMessage,
                                                      step,
                                                      setStep,
                                                      setErrorMessage,
                                                      setIsButtonLoading,
                                                      handleAuthSuccess,
                                                      setValue,
                                                      getValues,
                                                      handleSubmit
                                                  }) => {
    const [activeOtpIndex, setActiveOtpIndex] = useState<number | null>(null);
    const [timer, setTimer] = useState<number>(59);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const {actions}=useUserDataStore()
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const email = getValues("email");

    const validateOtpMutation = useMutation({
        mutationFn: (data: { email: string; otp: number }) => validateOtp(data.email, data.otp),
        onSuccess: (response) => {
            if (response.data.accessToken && response.data.refreshToken) {
                actions.setUserDataAction(email,"email")
                handleAuthSuccess(response.data)
            }
        },
        onError: (error: AxiosError<ValidationErrorResponse>) => {
            const responseData = error.response?.data;
            if (responseData?.isDataRequired) {
                setStep(3);
            } else {
                setErrorMessage("Неверный OTP. Пожалуйста, попробуйте еще раз.");
            }
        },
    });
    useEffect(() => {
        setTimer(59);
        setIsResendEnabled(false);
    }, []);
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const pastedText = event.clipboardData?.getData("text");
            if (pastedText && pastedText.length === 6) {
                pastedText.split("").forEach((char, index) => {
                    if (inputRefs.current[index]) {
                        inputRefs.current[index]!.value = char;
                        setActiveOtpIndex(index);
                    }
                });
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => {
            document.removeEventListener("paste", handlePaste);
        };
    }, [inputRefs, setActiveOtpIndex]);
    const handleResendCode = () => {
        if (isResendEnabled) {
            setTimer(59);
            setIsResendEnabled(false);
        }
    };
    const handleOtpChange = (index: number, value: string) => {
        if (/^\d$/.test(value)) {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = value;
            }

            if (index < 5 && value) {
                inputRefs.current[index + 1]?.focus();
                setActiveOtpIndex(index + 1);
            }

            if (index > 0 && value === '') {
                inputRefs.current[index - 1]?.focus();
                setActiveOtpIndex(index - 1);
            }

            const otpValues = inputRefs.current.map((input) => input?.value).join('');

            if (otpValues.length === 6) {
                setValue('otp', Number(otpValues));
                validateOtpMutation.mutate({email, otp: Number(otpValues)});
            }
        }
    };
    useEffect(() => {
        if (timer > 0 && step === 2) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else if (timer === 0) {
            setIsResendEnabled(true);
        }
    }, [timer, step]);

    const onSubmit = (data: AuthFormValues) => {
        setIsButtonLoading(true);
        if (step === 2) {
            validateOtpMutation.mutate({email: data.email, otp: Number(data.otp)});
        }
    }
    const handleBack = () => {
        setStep(1)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['logo']}>
                <img src={RevampEcoIcon} alt="logo"/>
            </div>
            <div className={styles['auth-content']}>
                <h3>Проверочный код</h3>
                <p className={styles['email-display']}>Код из письма {email}</p>
            </div>
            <div className={styles['otp-inputs']}>
                {Array.from({length: 6}, (_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Backspace" && !e.currentTarget.value) {
                                inputRefs.current[index - 1]?.focus();
                                setActiveOtpIndex(index - 1);
                            }
                        }}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onFocus={() => setActiveOtpIndex(index)}
                        className={classNames({
                            [styles['active']]: activeOtpIndex === index,
                            [styles['filled']]: inputRefs.current[index]?.value,
                            [styles['input-error']]: errors.otp && activeOtpIndex === index,
                        })}
                    />
                ))}
            </div>
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
            <div className={styles['last-row']}>
                <button type="button" onClick={handleBack} className={styles['back-button']}>
                    <img src={ArrowBackIcon} alt="Arrow Back"/> Назад
                </button>
                <div className={styles['timer']}>
                    {timer > 0 ? (
                        <p className={styles['timer-content']}>Повторить через {formattedTimer(timer)}</p>
                    ) : (
                        <button type="button" onClick={handleResendCode} disabled={!isResendEnabled}>
                            Отправить новый код
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};


export default AuthFormStepsStep2;