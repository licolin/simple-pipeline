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
//             console.log("messages info is " + JSON.stringify(messages));
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
//                 let code = part.replace(/```/g, '').trim(); // `let` to allow reassignment
//                 // console.log("code info is " + code);
//                 const language = 'python';
//                 if (code.startsWith("python")) {
//                     code = code.substring(6).trim(); // Assign the result back to `code`
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
//             <div className="w-1/4 bg-white shadow-md p-4">
//                 <button
//                     onClick={startNewConversation}
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//                     新建会话
//                 </button>
//             </div>
//
//
//             {/* part one */}
//             <div className="w-3/4 flex flex-col items-center bg-gray-100 pt-2 h-screen">
//                 <h1 className="text-md font-bold mb-2">会话</h1>
//
//                 {/* Chat messages container */}
//                 <div ref={chatBoxRef}
//                      className="flex-grow mb-3 overflow-y-auto p-4 rounded max-w-4xl mx-auto w-full">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
//                             <span
//                                 className={`inline-block px-4 py-2 break-words whitespace-pre-wrap rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
//                                 {renderMessageContent(msg.content)}
//                             </span>
//                         </div>
//                     ))}
//                     {loading && <div className="text-center">让小千想想...</div>}
//                 </div>
//             </div>
//             {/* part two */}
//             <div className="fixed bottom-0 w-full left-[52px] pb-4 border-0">
//                 <div className="flex items-center max-w-4xl mx-auto w-full">
//                     <textarea
//                         ref={textareaRef}
//                         value={input}
//                         onChange={handleInputChange}
//                         className="w-full h-5 py-1 px-2 border-none outline-none resize-none overflow-hidden rounded-lg shadow-lg"
//                         // style={{minHeight: '30px', maxHeight: '150px'}}
//                         placeholder="输入提示词 ..."
//                         onKeyDown={handleKeyDown}
//                     />
//                     <button
//                         onClick={sendMessage}
//                         disabled={!input.trim()}
//                         className={`ml-2 p-1 w-10 rounded text-sm ${input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
//                     >
//                         发送
//                     </button>
//                 </div>
//             </div>
//
//         </div>
//     );
// };
//
// export default Chatbot;

'use client';

import React, {useState, useEffect, useRef} from 'react';
import CodeBlock from '@/app/other/CodeBlock';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Chatbot: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null); // For scrolling control

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
            <div className="w-1/5 bg-white shadow-md p-4">
                <button
                    onClick={startNewConversation}
                    className="w-full bg-blue-500 text-white py-[6px] text-sm rounded hover:bg-blue-600">
                    新建会话
                </button>
            </div>

            {/* Main Chat Area */}
            <div className="w-4/5 flex flex-col items-center bg-gray-100 pt-2 h-screen">
                {/* part one */}
                <div className="w-full max-w-4xl rounded p-3 flex flex-col h-5/6">
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
                            className="w-full h-5 py-1 px-2 border-none outline-none resize-none overflow-hidden rounded-lg shadow-lg"
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

