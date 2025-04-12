import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

interface ISelectedMessagesStoreState {
  SelectedMessagesStoreState: {
    selectedMessages: number[];
  };
  setSelectedMessagesAction: (id: number) => void;
  ClearSelectedMessagesAction: () => void;
}

const SelectedMessagesStore = create<ISelectedMessagesStoreState>()(
  persist(
    immer(
      devtools(
        (set) => ({
          SelectedMessagesStoreState: {
            selectedMessages: [],
          },

          setSelectedMessagesAction: (id: number) =>
            set(({ SelectedMessagesStoreState }) => {
              const { selectedMessages } = SelectedMessagesStoreState;

              if (selectedMessages.includes(id)) {
                SelectedMessagesStoreState.selectedMessages =
                  selectedMessages.filter((messageId) => messageId !== id);
              } else {
                SelectedMessagesStoreState.selectedMessages.push(id);
              }
            }),
          ClearSelectedMessagesAction: () =>
            set(({ SelectedMessagesStoreState }) => {
              SelectedMessagesStoreState.selectedMessages = [];
            }),
        }),
        { name: "selectedMessagesStore" }
      )
    ),
    {
      name: "selectedMessages",
      getStorage: () => localStorage,
    }
  )
);

export const useSelectedMessagesStore = () => {
  const { setSelectedMessagesAction, ClearSelectedMessagesAction } =
    SelectedMessagesStore();

  const getHandleMessagesSelector = SelectedMessagesStore(
    (state) => state.SelectedMessagesStoreState.selectedMessages
  );

  return {
    actions: {
      setSelectedMessagesAction,
      ClearSelectedMessagesAction,
    },
    selectors: {
      getHandleMessagesSelector,
    },
  };
};
