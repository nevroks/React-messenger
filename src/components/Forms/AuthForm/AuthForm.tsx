import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AuthFormValues, authSchema} from "../../../utils/validation/authSchema";
import styles from "./style.module.scss";
import AuthFormStepsStep1 from "./AuthFormSteps/AuthFormStepsStep1";
import AuthFormStepsStep2 from "./AuthFormSteps/AuthFormStepsStep2";
import AuthFormStepsStep3 from "./AuthFormSteps/AuthFormStepsStep3";
import AuthFormStepsStep4 from "./AuthFormSteps/AuthFormStepsStep4";
import {useJWTTokenStore} from "../../../stores/JWTStore";
import {JWTTokenType} from "../../../utils/types";
import {useNavigate} from "react-router-dom";
import {decodeJwt} from "../../../utils/helpers/decodeJwt.ts";
import {useUserDataStore} from "../../../stores/UserDataStore";

const AuthForm = () => {
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {actions} = useUserDataStore()
    const updateFirstName = useJWTTokenStore((state) => state.setCurrentJWTTokenAction)

    const navigate = useNavigate()
    console.log(import.meta.env.VITE_BACKEND_URL);
    
    const {
        register,
        handleSubmit,
        formState: {isSubmitting, isValid, errors},
        getValues,
        watch,
        setValue,
    } = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        mode: "onChange",
    });

    const handleAuthSuccess = (JWT: JWTTokenType) => {
        updateFirstName(JWT)
        actions.setUserDataAction(decodeJwt(JWT.accessToken).companies, "companies")
        console.log(decodeJwt(JWT.accessToken).companies);
        
        navigate("/chat", {replace: true});
    }
    useEffect(() => {
        setErrorMessage(null);
    },[step])
    return (
        <div className={styles['auth-form']}>
            {step === 1 && (
                <AuthFormStepsStep1
                    register={register}
                    handleSubmit={handleSubmit}
                    isValid={isValid}
                    errorMessage={errorMessage}
                    isButtonLoading={isButtonLoading}
                    setIsButtonLoading={setIsButtonLoading}
                    setErrorMessage={setErrorMessage}
                    setStep={setStep}
                />
            )}
            {step === 2 && (
                <AuthFormStepsStep2
                    errors={errors}
                    errorMessage={errorMessage}
                    step={step}
                    setValue={setValue}
                    setStep={setStep}
                    setErrorMessage={setErrorMessage}
                    setIsButtonLoading={setIsButtonLoading}
                    handleAuthSuccess={handleAuthSuccess}
                    getValues={getValues}
                    handleSubmit={handleSubmit}
                />
            )}
            {step === 3 && (
                <AuthFormStepsStep3
                    register={register}
                    watch={watch}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    errorMessage={errorMessage}
                    setStep={setStep}
                />
            )}
            {step === 4 && (
                <AuthFormStepsStep4
                    handleAuthSuccess={handleAuthSuccess}
                    register={register}
                    handleSubmit={handleSubmit}
                    watch={watch}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    errorMessage={errorMessage}
                    setStep={setStep}
                    setErrorMessage={setErrorMessage}
                    setValue={setValue}
                />
            )}
        </div>
    );
};


export default AuthForm;