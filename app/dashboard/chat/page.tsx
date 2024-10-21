// 'use client';
//
// import React, {useState, useEffect, useRef} from 'react';
// import CodeBlock from '@/app/other/CodeBlock';
//
// interface Message {
//     role: 'user' | 'assistant';
//     content: string;
// }
//
// const Chatbot: React.FC = () => {
//     const [input, setInput] = useState<string>('');
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     const chatBoxRef = useRef<HTMLDivElement>(null); // For scrolling control
//
//     const sendMessage = async () => {
//         if (!input.trim()) return;
//
//         const userMessage: Message = {role: 'user', content: input};
//         setMessages((prevMessages) => [...prevMessages, userMessage]);
//         setInput('');
//         setLoading(true);
//
//         try {
//             const response = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     content: input,
//                 }),
//             });
//
//             const data = await response.json();
//             const botMessage: Message = {role: 'assistant', content: data.data.response};
//
//             setMessages((prevMessages) => [...prevMessages, botMessage]);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setInput(e.target.value);
//     };
//
//     const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };
//
//     useEffect(() => {
//         if (textareaRef.current) {
//             textareaRef.current.style.height = 'auto';
//             textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//         }
//     }, [input]);
//
//     useEffect(() => {
//         if (chatBoxRef.current) {
//             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//         }
//     }, [messages]);
//
//     const renderMessageContent = (content: string) => {
//         const parts = content.split(/(```[^`]+```)/).filter(Boolean);
//         return parts.map((part, index) => {
//             const isCodeBlock = part.startsWith('```') && part.endsWith('```');
//             if (isCodeBlock) {
//                 let code = part.replace(/```/g, '').trim();
//                 const language = 'python';
//                 if (code.startsWith("python")) {
//                     code = code.substring(6).trim();
//                 }
//                 return <CodeBlock key={index} language={language} code={code}/>;
//             }
//             return <span className="text-sm" key={index}>{part}</span>;
//         });
//     };
//
//     const startNewConversation = () => {
//         setMessages([]); // Clear all messages for a new conversation
//     };
//
//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Sidebar */}
//             <div className="w-1/5 bg-white shadow-md p-4">
//                 <button
//                     onClick={startNewConversation}
//                     className="w-full bg-blue-500 text-white py-[6px] text-sm rounded hover:bg-blue-600">
//                     新建会话
//                 </button>
//             </div>
//
//             {/* Main Chat Area */}
//             <div className="w-4/5 flex flex-col items-center bg-gray-100 pt-2 h-screen">
//                 {/* part one */}
//                 <div className="w-full max-w-4xl rounded p-3 flex flex-col h-5/6">
//                     <h1 className="text-md font-bold mb-2">会话</h1>
//
//                     {/* Chat messages container */}
//                     <div ref={chatBoxRef}
//                          className="flex-grow mb-3 overflow-y-auto p-4 rounded max-w-4xl mx-auto w-full">
//                         {messages.map((msg, index) => (
//                             <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
//                                 <span
//                                     className={`inline-block px-4 py-2 break-words whitespace-pre-wrap rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//                                     {renderMessageContent(msg.content)}
//                                 </span>
//                             </div>
//                         ))}
//                         {loading && <div className="text-center">让小千想想...</div>}
//                     </div>
//                 </div>
//
//                 {/* part two */}
//                 <div className="fixed bottom-0 w-4/5 left-1/5 pb-4 border-0">
//                     <div className="flex items-center max-w-4xl mx-auto w-full">
//                         <textarea
//                             ref={textareaRef}
//                             value={input}
//                             onChange={handleInputChange}
//                             className="w-full h-5 py-1 px-2 border-none outline-none resize-none overflow-hidden rounded-lg shadow-lg"
//                             placeholder="输入提示词 ..."
//                             onKeyDown={handleKeyDown}
//                         />
//                         <button
//                             onClick={sendMessage}
//                             disabled={!input.trim()}
//                             className={`ml-2 p-1 w-10 rounded text-sm ${input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
//                         >
//                             发送
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Chatbot;


'use client';

import React, {useState, useEffect, useRef} from 'react';
import CodeBlock from '@/app/other/CodeBlock';
import {LuPanelLeftClose} from "react-icons/lu";
import {LuPanelRightClose} from "react-icons/lu";
import {TbNewSection} from "react-icons/tb";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Chatbot: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // Sidebar open state

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null); // For scrolling control
    const [isHovered, setIsHovered] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {role: 'user', content: input};
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: input,
                }),
            });

            const data = await response.json();
            const botMessage: Message = {role: 'assistant', content: data.data.response};

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const renderMessageContent = (content: string) => {
        const parts = content.split(/(```[^`]+```)/).filter(Boolean);
        return parts.map((part, index) => {
            const isCodeBlock = part.startsWith('```') && part.endsWith('```');
            if (isCodeBlock) {
                let code = part.replace(/```/g, '').trim();
                const language = 'python';
                if (code.startsWith("python")) {
                    code = code.substring(6).trim();
                }
                return <CodeBlock key={index} language={language} code={code}/>;
            }
            return <span className="text-sm" key={index}>{part}</span>;
        });
    };

    const startNewConversation = () => {
        setMessages([]); // Clear all messages for a new conversation
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="w-1/5 bg-white shadow-md px-4 py-2 flex justify-between relative">
                    <span onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          className="relative cursor-pointer"> <LuPanelLeftClose onClick={() => setSidebarOpen(!sidebarOpen)} size={20}/> </span>
                    {isHovered && (
                        <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-gray-600 rounded-md z-10">
                    关闭侧边栏
                    </span>
                    )}
                    <span> <TbNewSection size={20}/> </span>
                </div>
            )}


            {/* Main Chat Area */}
            <div
                className={`flex-grow flex flex-col items-center bg-gray-100 py-2 h-screen transition-all duration-300 ${sidebarOpen ? 'w-4/5' : 'w-full'}`}>
                {/* part one */}
                {!sidebarOpen && (
                    <div className="w-full px-2 flex justify-start">
                        <span className="px-2 relative cursor-pointer"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}> <LuPanelRightClose onClick={() => setSidebarOpen(!sidebarOpen)}
                                                                  size={20}/> </span>
                        {isHovered && (
                            <span className="absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-gray-600 rounded-md z-10">
                    关闭侧边栏
                    </span>
                        )}
                        <span className="px-1"> <TbNewSection size={20}/> </span>
                    </div>
                )}
                <div className={`w-full max-w-4xl rounded flex flex-col h-5/6 ${!sidebarOpen? 'py-0':'py-3'}`}>
                    <h1 className="text-md font-bold mb-2">会话</h1>

                    {/* Chat messages container */}
                    <div ref={chatBoxRef}
                         className="flex-grow mb-3 overflow-y-auto p-4 rounded max-w-4xl mx-auto w-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <span
                                    className={`inline-block px-4 py-2 break-words whitespace-pre-wrap rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                    {renderMessageContent(msg.content)}
                                </span>
                            </div>
                        ))}
                        {loading && <div className="text-center">让小千想想...</div>}
                    </div>
                </div>

                {/* part two */}
                <div className="fixed bottom-0 w-4/5 left-1/5 pb-4 border-0">
                    <div className="flex items-center max-w-4xl mx-auto w-full">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputChange}
                            rows={1}
                            className="w-full h-[30px] py-2 px-2 border-none outline-none overflow-hidden rounded-lg shadow-lg rounded-full"
                            placeholder="输入提示词 ..."
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className={`ml-2 p-1 w-10 rounded text-sm ${input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            发送
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;


