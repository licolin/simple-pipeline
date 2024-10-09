import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
// @ts-ignore
import {fetchFilteredInvoices, fetchFilteredPipelines} from '@/app/lib/data.ts';
import Link from 'next/link';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const pipelines = await fetchFilteredPipelines(query, currentPage);

  // @ts-ignore
  return (
    <div className="mt-2 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="md:pt-0 mr-2 text-gray-900 bg-white rounded shadow-md">
          <table className="hidden min-w-full text-gray-900 md:table border-t border-gray-300">
            <thead className="text-left text-sm font-bold bg-gray-200 p-0">
            <tr className="font-bold border-b border-gray-300 ">
              <th scope="col" className="px-4 py-2 sm:pl-6">
                名称
              </th>
              <th scope="col" className="px-3 py-2">
                描述
              </th>
              <th scope="col" className="px-3 py-2">
                创建人
              </th>
              <th scope="col" className="px-3 py-2">
                创建时间
              </th>
              <th scope="col" className="px-3 py-2">
                操作
              </th>
            </tr>
            </thead>
            <tbody className="bg-white">
              {pipelines?.map((invoice) => (
                  <tr
                      key={invoice.name}
                      className="w-full border-b py-2 text-sm hover:bg-blue-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-sm [&:first-child>td:last-child]:rounded-tr-sm [&:last-child>td:first-child]:rounded-bl-sm [&:last-child>td:last-child]:rounded-br-sm"
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-xs pl-6 pr-3">
                      {/*<div className="flex items-center gap-3 text-xs">*/}
                      {invoice.name}
                        {/*<p>{invoice.name}</p>*/}
                      {/*</div>*/}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs font-mono">
                      {invoice.description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-sm">
                      {invoice.creator}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm font-mono">
                      {/*{formatCurrency(invoice.amount)}*/}
                      {/*{formatDateToLocal(invoice.create_time)}*/}
                      {formatDateToLocal(invoice.create_time.toISOString())}
                    </td>
                    {/*<td className="whitespace-nowrap px-3 py-1.5">*/}
                    {/*  /!*{formatDateToLocal(invoice.active)}*!/*/}
                    {/*  {invoice.active}*/}
                    {/*</td>*/}
                    {/*<td className="whitespace-nowrap px-3 py-3">*/}
                    {/*  <InvoiceStatus status={invoice.status} />*/}
                    {/*</td>*/}
                    <td className="whitespace-nowrap py-2 px-3">
                      <div className="flex justify-start gap-3">
                        <Link className="text-xs underline text-blue-500 hover:cursor-pointer" href={`/dashboard/pipeline/${invoice.id}/edit`}>编辑流程</Link>
                        <Link className="text-xs underline text-blue-500 hover:cursor-pointer" href={`/dashboard/pipeline/execute/${invoice.id}/exec`}>进入流程</Link>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}