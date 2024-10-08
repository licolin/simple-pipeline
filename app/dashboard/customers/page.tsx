// @ts-ignore
import { fetchFilteredCustomers } from '@/app/lib/data.ts';
import CustomersTable from '@/app/ui/customers/table';
import { Metadata } from 'next';
import {lusitana} from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import {CreatePipeline} from "@/app/ui/invoices/buttons";
import {Suspense} from "react";
import {InvoicesTableSkeleton} from "@/app/ui/skeletons";
import Table from "@/app/ui/pipeline/table";
import Pagination from "@/app/ui/invoices/pagination";
import InputVariablesTable from "@/app/ui/test/test";

export const metadata: Metadata = {
  title: 'Customers',
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

  const customers = await fetchFilteredCustomers(query);

  return (
      <main>
        {/*<CustomersTable customers={customers} />*/}
        <InputVariablesTable />
      </main>
  );
}
