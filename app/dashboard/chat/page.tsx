// 'use client';
//
// import React, { useState,useEffect,useRef } from 'react';
// import CodeBlock from '@/app/other/CodeBlock';
// // import React, {useEffect, useState} from "react";
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
//
//     const sendMessage = async () => {
//         if (!input.trim()) return;
//
//         console.log("input info is "+input);
//         const userMessage: Message = { role: 'user', content: input };
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
//                 // body: JSON.stringify({
//                 //     messages: [...messages, userMessage],
//                 // }),
//                 body: JSON.stringify({
//                     content:input,
//                 }),
//             });
//
//             const data = await response.json();
//             console.log("chat response is "+JSON.stringify(data));
//             console.log("code information is "+JSON.stringify(data.data.response));
//             const botMessage: Message = { role: 'assistant', content: data.data.response };
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
//         if (e.key === 'Enter' && !e.shiftKey) {  // Check for Shift key to allow line breaks
//             e.preventDefault();  // Prevent the default behavior of adding a newline
//             sendMessage();
//         }
//     };
//
//     useEffect(() => {
//         if (textareaRef.current) {
//             textareaRef.current.style.height = 'auto';  // Reset height to recalculate
//             textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;  // Set height based on content
//         }
//     }, [input]);  // Adjust height whenever input changes
//
//
//     const renderMessageContent = (content: string) => {
//         const parts = content.split(/(```(.*?)```)/s); // 拆成多个部分
//         // const parts = content.split(/(?:```(.*?)```)/gs);
//         console.log("content "+content);
//         // const parts = content.split(/(```(.*?)```)/s).filter(part => part.trim() !== '');
//         // const parts = content.split(/```(.*?)```/s);
//
//         console.log("parts: " + JSON.stringify(parts));
//
//         return parts.map((part, index) => {
//             // console.log("part: " + part);
//             const isCodeBlock = part.startsWith('```') && part.endsWith('```');
//             if (isCodeBlock) {
//                 const code = part.replace(/```/g, '').trim();
//                 const language = 'python'; // You can customize the language if needed
//                 return <CodeBlock key={index} language={language} code={code} />;
//             }
//
//             return <span key={index}>{part}</span>; // Return the text part as is
//         });
//     };
//
//     return (
//         <div className="flex flex-col items-center bg-gray-100 pt-1">
//             <div className="w-full max-w-4xl bg-white rounded shadow-lg p-3 h-screen">
//                 <h1 className="text-2xl font-bold mb-2">Chatbot</h1>
//                 <div className="chat-box mb-3 overflow-y-auto h-3/4 bg-gray-50 p-4 rounded">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
//                             <span
//                                 className={`inline-block px-4 py-2 rounded ${
//                                     msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'
//                                 }`}
//                             >
//                                 {/*{msg.content}*/}
//                                 {/*{msg.role === 'assistant' && msg.content.startsWith('```') ? (*/}
//                                 {/*    <CodeBlock language="python" code={msg.content.replace(/```/g, '')} />*/}
//                                 {/*) : (*/}
//                                 {/*    msg.content*/}
//                                 {/*)}*/}
//                                 {renderMessageContent(msg.content)}
//
//                             </span>
//                         </div>
//                     ))}
//                     {loading && <div className="text-center">让小千想想...</div>}
//                 </div>
//                 <div className="flex">
//                     <textarea
//                         // type="text"
//                         ref={textareaRef}
//                         value={input}
//                         // onChange={(e) => {setInput(e.target.value);}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border-none outline-none resize-none overflow-hidden"
//                         style={{ minHeight: '30px', maxHeight: '200px' }}
//                         placeholder="输入提示词 ..."
//                         // onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                         onKeyDown={handleKeyDown}
//                     />
//                     <button
//                         onClick={sendMessage}
//                         className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                         发送
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Chatbot;


// 'use client';
//
// import React, { useState, useEffect, useRef } from 'react';
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
//         const userMessage: Message = { role: 'user', content: input };
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
//             const botMessage: Message = { role: 'assistant', content: data.data.response };
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
//         // Scroll to the bottom of the chat box when new messages arrive
//         if (chatBoxRef.current) {
//             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//         }
//     }, [messages]);
//
//     const renderMessageContent = (content: string) => {
//         const parts = content.split(/(```(.*?)```)/s);
//         return parts.map((part, index) => {
//             const isCodeBlock = part.startsWith('```') && part.endsWith('```');
//             if (isCodeBlock) {
//                 const code = part.replace(/```/g, '').trim();
//                 const language = 'python';
//                 return <CodeBlock key={index} language={language} code={code} />;
//             }
//             return <span key={index}>{part}</span>;
//         });
//     };
//
//     return (
//         <div className="flex flex-col items-center bg-gray-100 pt-1 h-screen">
//             <div className="w-full max-w-4xl bg-white rounded shadow-lg p-3 flex flex-col h-full">
//                 <h1 className="text-2xl font-bold mb-2">Chatbot</h1>
//
//                 <div ref={chatBoxRef} className="flex-grow mb-3 overflow-y-auto bg-gray-50 p-4 rounded">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
//                             <span className={`inline-block px-4 py-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
//                                 {renderMessageContent(msg.content)}
//                             </span>
//                         </div>
//                     ))}
//                     {loading && <div className="text-center">让小千想想...</div>}
//                 </div>
//
//                 <div className="flex items-end">
//                     <textarea
//                         ref={textareaRef}
//                         value={input}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border-none outline-none resize-none overflow-hidden rounded"
//                         style={{ minHeight: '30px', maxHeight: '150px' }}
//                         placeholder="输入提示词 ..."
//                         onKeyDown={handleKeyDown}
//                     />
//                     <button
//                         onClick={sendMessage}
//                         className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                         发送
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Chatbot;


'use client';

import React, { useState, useEffect, useRef } from 'react';
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

        const userMessage: Message = { role: 'user', content: input };
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
            const botMessage: Message = { role: 'assistant', content: data.data.response };

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
        // Scroll to the bottom of the chat box when new messages arrive
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const renderMessageContent = (content: string) => {
        const parts = content.split(/(```[^`]+```)/).filter(Boolean);
        return parts.map((part, index) => {
            const isCodeBlock = part.startsWith('```') && part.endsWith('```');
            if (isCodeBlock) {
                const code = part.replace(/```/g, '').trim();
                const language = 'python';
                return <CodeBlock key={index} language={language} code={code} />;
            }
            return <span className="text-sm" key={index}>{part}</span>;
        });
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 pt-1 h-screen">
            {/* part one */}
            <div className="w-full max-w-4xl bg-white rounded shadow-lg p-3 flex flex-col h-5/6">
                <h1 className="text-md font-bold mb-2">会话</h1>

                {/* Chat messages container */}
                <div ref={chatBoxRef}
                     className="flex-grow mb-3 overflow-y-auto bg-gray-50 p-4 rounded max-w-4xl mx-auto w-full">
                    {messages.map((msg, index) => (
                        <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <span
                                className={`inline-block px-4 py-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                                {renderMessageContent(msg.content)}
                            </span>
                        </div>
                    ))}
                    {loading && <div className="text-center">让小千想想...</div>}
                </div>

            </div>

            {/* part two */}
            <div className="fixed bottom-0 w-full left-[52px] pb-3 border-0">
                <div className="flex items-center max-w-4xl mx-auto w-full">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        className="w-full h-5 py-1 px-2 border-none outline-none resize-none overflow-hidden rounded-lg shadow-lg"
                        // style={{minHeight: '30px', maxHeight: '150px'}}
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
    );
};

export default Chatbot;
