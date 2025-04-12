import { immer } from "zustand/middleware/immer";
import { devtools, persist } from 'zustand/middleware';
import { create } from "zustand";

import { UserDataType } from "../../utils/types";

interface IUserDataStoreState {
    userData: UserDataType;
    setUserDataAction: (userData: string | number[], field: "firstName" | "lastName" | "companies" | "email") => void
}

const UserDataStore = create<IUserDataStoreState>()(
    devtools(persist(immer((set) => ({
        userData: {
            email: "",
            firstName: "",
            lastName: "",
            companies: [0],
        },
        setUserDataAction: (userDataField: string | number[], field: "firstName" | "lastName" | "companies" | "email") =>
            set(({ userData }) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                userData[field] = userDataField;
            })
    })),
        {
            name: "Stored_UserData"
        }
    ),
        { name: "UserDataStore" }
    )
);


// ----Custom hook----
export const useUserDataStore = () => {
    const { setUserDataAction } = UserDataStore()
    const getUserCompaniesSelector = UserDataStore(state => state.userData.companies)
    const getUserEmailSelector = UserDataStore(state => state.userData.email)
    const clearUserDataPersistedStorageAction = UserDataStore.persist.clearStorage;

    return {
        actions: {
            setUserDataAction,
            clearUserDataPersistedStorageAction
        },
        selectors: {
            getUserCompaniesSelector,
            getUserEmailSelector,
        }
    };
};
// ----Custom hook----