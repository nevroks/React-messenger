import { useParams, useSearchParams } from "react-router-dom";
import classes from "./style.module.scss"
import { useQuery } from "@tanstack/react-query";
import { getFilteredMessagesFromChatBySeaechQuery } from "../../utils/services/chatsRest.sevrice";
import { AnimatePresence, motion } from "framer-motion";
import MessageItem from "../../components/MessageItem/MessageItem";
import { useState } from "react";

const SingleChatSearchPage = () => {
    const {id} = useParams<string>()
    const [contextMenuMessageId, setContextMenuMessageId] = useState<string | null>(null);
    const [searchParams,setSearchParams] = useSearchParams()
    const search = searchParams.get("search")
    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };
    const {data:chatMessages,isLoading}=useQuery({
        queryFn: ()=>getFilteredMessagesFromChatBySeaechQuery(id!,search!),
        queryKey: ["getFilteredMessagesFromChatBySeaechQuery",id,search],
    })
    if(isLoading){
        return
    }

    return (
       <div className={classes["SingleChatSearchPage"]}>
            <div className={classes['message-list']}>
                    <AnimatePresence>
                        {chatMessages?.length === 0 ? (
                            <div className={classes['empty-chat-message']}>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className={classes['empty-chat-title']}
                                >
                                    Сообщения не найдены.
                                </motion.p>
                            </div>
                        ) : (
                            chatMessages?.map((message, index) => (
                                // @ts-ignore
                                <MessageItem
                                key={message.id ? message.id : `message-${index}`}
                                message={message}
                                onUserClick={() => { }}
                                contextMenuMessageId={contextMenuMessageId}
                                setContextMenuMessageId={setContextMenuMessageId}
                                pinnedMessageId={null}
                                replyId={message.replied}
                            />
                            ))
                        )}
                    </AnimatePresence>
                </div>
       </div>
    );
};
export default SingleChatSearchPage;