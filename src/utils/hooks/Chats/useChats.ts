import { useChatsStore } from "../../../stores/ChatsStore";
import { APP_PATHS } from "../../consts/AppConsts";
import router from "../../router/router";
import useChatsSocket, { LeaveUserPayloadType } from "./useChatsSocket";

const useChats = () => {

    const { actions: socketActions } = useChatsSocket()
    const { actions: storeActions } = useChatsStore()
    // Если хочется изменить чтото то можно так
    // ----------------------------------------
    // const modifiedCreateNewChat = (props) => {
    //     const changedProps = {...props}.filter(some filter)
    //     actions.createNewChat(changedProps)
    // } 
    // ----------------------------------------
    // Если хочется изменить чтото то можно так
    const leaveFromChat = async ({ chatId }: LeaveUserPayloadType,) => {
        
        storeActions.deleteChatFromChatsStoreAction(chatId)
        await router.navigate(APP_PATHS.CHAT_PAGE, { replace: true })
        socketActions.leaveFromChat({ chatId })
    }

    const actions = { ...socketActions, leaveFromChat: leaveFromChat }

    return { ...actions };
};

export default useChats;