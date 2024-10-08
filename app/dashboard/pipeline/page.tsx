import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/pipeline/table';
import { CreatePipeline } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
// @ts-ignore
import {fetchInvoicesPages, fetchPipelinePage} from '@/app/lib/data.ts';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'pipeline',
};

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchPipelinePage(query);

    return (
        <div className="min-h-screen w-full bg-Fuchsia-50">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-sm mt-1 font-bold`}>流程集合</h1>
            </div>
            <div className="mt-1 flex justify-start gap-2 md:mt-2">
                <Search placeholder="查询流程..." />
                <CreatePipeline />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
