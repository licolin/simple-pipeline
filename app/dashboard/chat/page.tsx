'use client';

import React, {useState, useEffect, useRef} from 'react';
import CodeBlock from '@/app/other/CodeBlock';
import {LuPanelLeftClose} from "react-icons/lu";
import {LuPanelRightClose} from "react-icons/lu";
import {TbNewSection} from "react-icons/tb";
import {useSession} from "next-auth/react";
import {insertMessage} from "@/app/lib/req";
import {FaDatabase} from "react-icons/fa6";
import {BiBroadcast} from "react-icons/bi";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Conversation {
    username: string;
    title: string;
}

const Chatbot: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true); // Sidebar open state

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null); // For scrolling control
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered_1, setIsHovered_1] = useState(false);
    const [isHovered_2, setIsHovered_2] = useState(false);
    const [isHovered_3, setIsHovered_3] = useState(false);
    const [title, setTitle] = useState('');
    const {data: session, status} = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchConversations = async (username: string) => {
        try {
            const response = await fetch(`/api/chat/insert?username=${username}`, {
                method: 'GET',
            });

            const data = await response.json();

            if (data.success) {
                setConversations(data.data);
            } else {
                console.error('Failed to fetch conversations.');
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const handleConversationClick = async (title: string) => {
        try {
            const response = await fetch('/api/chat/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: session?.user?.email, // Sending username
                    title: title,   // Sending conversation title
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const parsedMessages: Message[] = data.data.map((item: { message: string }) =>
                    JSON.parse(item.message)
                );
                setMessages(parsedMessages);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };


    useEffect(() => {
        if (session?.user?.email) {
            // Pass the logged-in user's email (or username) to the API request
            fetchConversations(session.user.email);
        }
    }, [session]);


    const sendMessage = async () => {
        if (!input.trim()) return;
        if (!title.trim()) {
            setTitle(input.trim());
        }

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

            if (session?.user?.email) {
                const ret_req = await insertMessage(session?.user?.email, title, userMessage);
                const ret_resp = await insertMessage(session?.user?.email, title, botMessage);
                console.log("req info is " + JSON.stringify(ret_req));
                console.log("resp info is " + JSON.stringify(ret_resp));
            }

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
        // console.log("msg info");

        const parts = content.split(/(```[^`]+```)/).filter(Boolean);
        return parts.map((part, index) => {
            const isCodeBlock = part.startsWith('```') && part.endsWith('```');
            if (isCodeBlock) {
                let code = part.replace(/```/g, '').trim();
                let language: string = '';
                const languageMap: { [key: string]: string } = {
                    'python': 'python',
                    'javascript': 'javascript',
                    'typescript': 'typescript',
                    'java': 'java',
                    'json': 'json',
                    'sql': 'sql',
                    'cpp': 'cpp',
                    'c#': 'csharp',
                    'csharp': 'csharp',
                    'c++': 'cpp',
                };
                for (const [key, value] of Object.entries(languageMap)) {
                    if (code.startsWith(key)) {
                        code = code.substring(key.length).trim();
                        language = value;
                        break;
                    }
                }

                return <CodeBlock key={index} language={language} code={code}/>;
            }
            return <span className="text-sm" key={index}>{part}</span>;
        });
    };

    const startNewConversation = () => {
        setTitle('');
        setMessages([]); // Clear all messages for a new conversation
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="w-1/5 bg-white shadow-md ">
                    <div className="w-full px-2 py-2 flex justify-between relative overflow-visible">
                            <span onMouseEnter={() => setIsHovered_2(true)}
                                  onMouseLeave={() => setIsHovered_2(false)}
                                  className="cursor-pointer px-1 py-[2px] relative hover:bg-gray-300 rounded">
                                <LuPanelLeftClose onClick={() => setSidebarOpen(false)} size={20}/>
                                {isHovered_2 && (
                                    <span
                                        className="absolute top-full left-0 mt-[2px] bg-gray-600 text-white text-xs px-1 py-1 rounded whitespace-nowrap">
                                        关闭
                                    </span>
                                )}
                            </span>

                        <span onMouseEnter={() => setIsHovered_3(true)}
                              onMouseLeave={() => setIsHovered_3(false)}
                              className="hover:bg-gray-300 rounded px-1 py-[2px]">
                                    <TbNewSection onClick={startNewConversation} size={20}/>
                            {isHovered_3 && (
                                <span
                                    className="absolute left-full ml-1 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                新建会话
                                            </span>
                            )}
                            </span>
                    </div>
                    {/* sidebar list get from postgresql */}
                    <div>
                        <div className="flex ml-3 hover:cursor-pointer">
                            <span className="py-1"><FaDatabase size={15}/></span>
                            <span className="text-xs font-bold py-1 mx-1">业务数据</span>
                            {/*<span className="text-xs font-bold py-2 mx-1">业务请求</span>*/}
                        </div>
                        <div className="flex ml-3 mb-1 hover:cursor-pointer">
                            <span className="py-1"><BiBroadcast size={15}/></span>
                            {/*<span className="text-xs font-bold py-2 mx-1">业务数据</span>*/}
                            <span className="text-xs font-bold py-1 mx-1">业务请求</span>
                        </div>
                        <span className="text-xs font-bold ml-1">历史记录</span>
                        {conversations.length > 0 ? (
                            conversations.map((conversation, index) => (
                                <div
                                    key={`${conversation.title}-${conversation.username}-${index}`} // Generate unique key
                                    className="mx-1 px-[8px] py-[3px] cursor-pointer hover:bg-gray-200 text-sm font-medium hover:rounded-md"
                                    onClick={() => handleConversationClick(conversation.title)}
                                >
                                    {conversation.title}
                                </div>
                            ))
                        ) : (
                            <div className="opacity-50 px-[10px] text-xs">没有历史会话记录</div>
                        )}
                    </div>
                    {/*<div>xxxxxxxxxxx</div>*/}
                </div>

            )}


            {/* Main Chat Area */}
            <div
                className={`flex-grow flex flex-col items-center bg-gray-100 py-2 h-screen transition-all duration-300 ${sidebarOpen ? 'w-4/5' : 'w-full'}`}>
                {/* part one */}
                {!sidebarOpen && (
                    <div className="w-full px-2 flex justify-start items-center relative">
                            <span className="px-1 py-[2px] cursor-pointer relative hover:bg-gray-300 rounded"
                                  onMouseEnter={() => setIsHovered(true)}
                                  onMouseLeave={() => setIsHovered(false)}>
                                <LuPanelRightClose onClick={() => setSidebarOpen(true)} size={20}/>
                                {isHovered && (
                                    <span
                                        className="absolute top-full left-0 mt-[2px] bg-gray-600 text-white text-xs px-1 py-1 rounded whitespace-nowrap">
                                        展开
                                    </span>
                                )}
                            </span>
                        <span className="px-1 py-[2px] cursor-pointer relative hover:bg-gray-300 rounded"
                              onMouseEnter={() => setIsHovered_1(true)}
                              onMouseLeave={() => setIsHovered_1(false)}>
                                <TbNewSection onClick={startNewConversation} size={20}/>
                            {isHovered_1 && (
                                <span
                                    className={`absolute left-full ml-1 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-800 ease-in-out ${isHovered_1 ? 'opacity-100' : 'opacity-0'}`}>
                                        新建会话
                                    </span>
                            )}
                            </span>
                    </div>
                )}
                <div className={`w-full max-w-4xl rounded flex flex-col h-5/6 ${!sidebarOpen ? 'py-0' : 'py-3'}`}>
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


