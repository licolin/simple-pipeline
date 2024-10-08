// import {WrenchScrewdriverIcon} from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';
import SportCard from '../../ui/process/Blocks'
import Search from "@/app/ui/search";
import {CreateProcess} from "@/app/ui/invoices/buttons";
import {fetchFilteredProcesses} from "@/app/lib/data";
import {lusitana} from "@/app/ui/fonts";
interface SportData {
    id: string;
    script_name: string;
    description: string;
}

export default async function Page({
                                       searchParams}: {
    searchParams?: {
        query?: string;
    };
}) {

    const query = searchParams?.query || '';
    const totalProcesses = await fetchFilteredProcesses(query);
    return (
        <div className="w-full bg-Fuchsia-50">
            <div className="flex w-full my-0 py-1">
                <span className={`${lusitana.className} text-sm font-bold`}>子流程</span>
            </div>
            <div className="flex justify-start my-0 text-xs">
                <Search placeholder="子流程查询..."/>
                <CreateProcess/>
            </div>
            <div className="mt-2 w-full px-2  h-full max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <div className="flex w-full bg-pink-50 p-3">
                        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5 hover:cursor-pointer w-full">
                            {totalProcesses.map((sport) => (
                                <SportCard key={sport.id} sport={sport}/>
                            ))}
                        </div>
                    </div>
                {/*</div>*/}
            </div>
        </div>
    );
}
