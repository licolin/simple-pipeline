import React, {useEffect, useRef, useState} from 'react';

interface SystemInfo {
    system_name: string;
}
interface Appointment {
    id: number;
    filename: string;
    system: SystemInfo;
    creator: string;
    create_time: string;
    update_time: string;
    // doctorName: string;
}

interface AppointmentTableProps {
    model: number;
    system_id: number; // Assuming clickedItemId is a string; adjust if it's a different type
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ model,system_id}) => {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [appointments,setAppointment] = useState([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: { target: any; }) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpenDropdownId(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Fetch specialty data from the database on component mount
        async function fetchFileInfo() {
            const response = await fetch(`/api/management/manage?systemId=${system_id}&model=${model}`);
            const data = await response.json();
            console.log("data "+JSON.stringify(data));
            setAppointment(data.data);
        }
        fetchFileInfo().then(r => console.log("fetch folder information!"));
    }, [model,system_id]);

    const toggleDropdown = (id: number) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const handleEdit = (id: number) => {
        console.log('Edit clicked for appointment ID:', id);
        // Add your edit logic here
        setOpenDropdownId(null); // Close dropdown after action
    };

    const handleDelete = (id: number) => {
        console.log('Delete clicked for appointment ID:', id);
        // Add your delete logic here
        setOpenDropdownId(null); // Close dropdown after action
    };


    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-t border-gray-200">
                <div className="divide-y divide-gray-200">
                    {/* Table header */}
                    <div className="px-4 py-3 sm:px-6 flex bg-gray-50">
                        <div className="text-sm font-medium text-gray-900 text-left w-1/6">文件名</div>
                        <div className="text-sm font-medium text-gray-900 text-left w-1/6">所属环境</div>
                        <div className="text-sm font-medium text-gray-900 text-left w-1/12">创建人</div>
                        <div className="text-sm font-medium text-gray-900 text-left w-1/6">创建日期</div>
                        <div className="text-sm font-medium text-gray-900 text-left w-1/6">修改日期</div>
                        <div className="text-sm font-medium text-gray-900 text-right w-1/6">操作</div>
                    </div>

                    {/* Table rows */}
                    {appointments?.length ? (appointments.map((appointment:Appointment) => (
                        <div
                            key={appointment.id}
                            className="px-4 py-2 sm:px-6 flex"
                        >
                            <div className="text-sm text-gray-900 w-1/6 text-left">{appointment.filename}</div>
                            <div className="text-sm text-gray-900 w-1/6 text-left">{appointment.system.system_name}</div>
                            <div className="text-sm text-gray-900 w-1/12 text-left">
                                {appointment.creator}
                            </div>
                            <div className="text-xs text-gray-900 w-1/6 text-left">{appointment.create_time.replace('T', ' ').split('.')[0]}</div>
                            <div className="text-xs text-gray-900 w-1/6 text-left">{appointment.update_time.replace('T', ' ').split('.')[0]}</div>
                            <div className="w-1/6 text-right">
                                {/* Add more actions or options as needed */}
                                <button
                                    onClick={() => toggleDropdown(appointment.id)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>

                                {openDropdownId === appointment.id && (
                                    <div ref={dropdownRef} className="absolute right-5 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
                                        <div className="py-1">

                                            <button
                                                onClick={()=>handleEdit(appointment.id)}
                                                className="block px-1 py-2 text-xs text-gray-700 hover:bg-gray-200 w-full"
                                            >
                                                编辑
                                            </button>
                                            <button
                                                onClick={()=>handleDelete(appointment.id)}
                                                className="block px-1 py-2 text-xs text-gray-700 hover:bg-gray-200 w-full"
                                            >
                                                删除
                                            </button>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    ))):(<div className="flex justify-center items-center h-10">
                            <p className="text-xs opacity-60 h-10 pt-3">没有文件</p>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentTable;