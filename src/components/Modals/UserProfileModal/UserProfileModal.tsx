import React, { useState, useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { fetchUserAttributes } from "../../../utils/helpers/fetchUserAttributes";
import { validatePhoneNumber } from "../../../utils/helpers/validatePhoneNumber";

// ICONS

import MoreIcon from "../../assets/icons/more.svg";
import ArrowIcon from "../../assets/icons/arrow.svg";
import Modal from "../../UI/Modal/Modal";

const MAX_DESCRIPTION_LENGTH = 250;

interface UserProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface UserAttributes {
  description: string;
  phone: string;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const [description, setDescription] = useState("Не указано");
  const [phone, setPhone] = useState("Не указано");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalDescription, setOriginalDescription] =
    useState("Не указано");
  const [originalPhone, setOriginalPhone] = useState("Не указано");
  const [formErrors, setFormErrors] = useState<{
    description?: string;
    phone?: string;
  }>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      fetchUserAttributes(
        userId,
        setDescription,
        setPhone,
        setLoading,
        setError,
        setOriginalDescription,
        setOriginalPhone
      );
    }
  }, [userId, isOpen]);

  const updateAttributes = async (
    newAttributes: UserAttributes
  ): Promise<void> => {
    // await updateUserAttributes(userId, newAttributes);
  };

  const mutation = useMutation<void, Error, UserAttributes>({
    mutationFn: updateAttributes,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAttributes", userId] });
      setIsEditing(false);
      setLoading(false);
      onClose();
    },
    onError: () => {
      setError("Failed to update user data");
      setLoading(false);
    },
  });

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      mutation.mutate({ description, phone });
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = () => {
    const errors: { description?: string; phone?: string } = {};
    if (!description || description.trim() === "") {
      errors.description = "Description is required";
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    const phoneError = validatePhoneNumber(phone);
    if (phoneError) {
      errors.phone = phoneError;
    }

    return errors;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDescription(originalDescription);
    setPhone(originalPhone);
    setFormErrors({});
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
    };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
    if (
      !allowedKeys.includes(e.key) &&
      !/^\d$/.test(e.key) &&
      !(
        e.key === "+" &&
        e.currentTarget.selectionStart === 0 &&
        !phone.includes("+")
      )
    ) {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles['user-profile-modal']}>
        {loading ? (
          <div className="loader-layout">
            <div className="loader" />
          </div>
        ) : (
          <>
            <div className={styles['top']}>
              <button>
                <img src={ArrowIcon} alt="" />
              </button>
              <button>
                <img src={MoreIcon} alt="" />
              </button>
            </div>
            <div className={styles['user-info-body']}></div>
            <div className={styles['form-group']}>
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                disabled={!isEditing}
              />
              {isEditing && (
                <div className={styles['char-count']}>
                  {description.length}/{MAX_DESCRIPTION_LENGTH} characters
                </div>
              )}
              {formErrors.description && (
                <div className={styles['form-error']}>{formErrors.description}</div>
              )}
            </div>
            {error && <div className={'error-message'}>{error}</div>}
            <div className={styles['form-group']}>
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={handleInputChange(setPhone)}
                onKeyDown={handlePhoneKeyDown}
                disabled={!isEditing}
              />
              {formErrors.phone && (
                <div className={styles['form-error']}>{formErrors.phone}</div>
              )}
            </div>
            {isEditing ? (
              <div className={styles['button-group']}>
                <button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={handleEdit}>Edit</button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default UserProfileModal;
