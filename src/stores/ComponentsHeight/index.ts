import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IComponentsHeightState {
    ComponentsHeightState: {
        contextMenuHeight: number;
        messagesHeight: number;
        windowLentHeight: number
    };
    setContextMenuHeightAction: (height: number) => void;
    setMessagesHeightAction: (height: number) => void;
    setWindowLentHeightAction: (height: number) => void;
}

const ComponentsHeightStore = create<IComponentsHeightState>()(
    persist(
        immer(
            devtools((set) => ({
                ComponentsHeightState: {
                    contextMenuHeight: 0,
                    messagesHeight: 0,
                    windowLentHeight: 0
                },
                setContextMenuHeightAction: (height) =>
                    set((state) => {
                        state.ComponentsHeightState.contextMenuHeight = height;
                    }),
                setMessagesHeightAction: (height) =>
                    set((state) => {
                        state.ComponentsHeightState.messagesHeight = height;
                    }),
                setWindowLentHeightAction: (height) =>
                    set((state) => {
                        state.ComponentsHeightState.windowLentHeight = height;
                    }),
            }))
        ),
        {
            name: "Components_Height",
        }
    )
);

export const useComponentsHeightStore = () => {
    const {
        setContextMenuHeightAction,
        setMessagesHeightAction,
        setWindowLentHeightAction
    } = ComponentsHeightStore();

    const getContextMenuHeightSelector = ComponentsHeightStore((state) => state.ComponentsHeightState.contextMenuHeight);
    const getmessagesHeightSelector = ComponentsHeightStore((state) => state.ComponentsHeightState.messagesHeight);
    const getWindowLentHeightSelector = ComponentsHeightStore((state) => state.ComponentsHeightState.windowLentHeight);

    const totalHeightSelector = ComponentsHeightStore((state) => {
        const contextMenuHeight = state.ComponentsHeightState.contextMenuHeight;
        const messagesHeight = state.ComponentsHeightState.messagesHeight;
        const windowLentHeight = state.ComponentsHeightState.windowLentHeight;

        if (windowLentHeight - messagesHeight >= contextMenuHeight) {
            return true
        } else {
            return false
        }


    });

    return {
        actions: {
            setContextMenuHeightAction,
            setMessagesHeightAction,
            setWindowLentHeightAction
        },
        selectors: {
            getContextMenuHeightSelector,
            getmessagesHeightSelector,
            totalHeightSelector,
            getWindowLentHeightSelector
        },
    };
};
