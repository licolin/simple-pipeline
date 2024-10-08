import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
// @ts-ignore
import { fetchFilteredInvoices } from '@/app/lib/data.ts';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-5 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    {/*<div className="mb-2 flex items-center">*/}
                    {/*  <Image*/}
                    {/*    src={invoice.image_url}*/}
                    {/*    className="mr-2 rounded-full"*/}
                    {/*    width={28}*/}
                    {/*    height={28}*/}
                    {/*    alt={`${invoice.name}'s profile picture`}*/}
                    {/*  />*/}
                    {/*  <p>{invoice.name}</p>*/}
                    {/*</div>*/}
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-md font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-md text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-2 py-3 font-medium sm:pl-6">
                  用户名
                </th>
                <th scope="col" className="px-2 py-3 font-medium">
                  Email
                </th>
                <th scope="col" className="px-2 py-3 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-2 py-3 font-medium">
                  活跃时间
                </th>
                <th scope="col" className="px-2 py-3 font-medium">
                  角色
                </th>
                <th scope="col" className="relative py-3 pl-3 pr-3">
                  <span className="px-2 py-3 font-medium">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-2 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/*<Image*/}
                      {/*  src={invoice.image_url}*/}
                      {/*  className="rounded-full"*/}
                      {/*  width={28}*/}
                      {/*  height={28}*/}
                      {/*  alt={`${invoice.name}'s profile picture`}*/}
                      {/*/>*/}
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-2 pl-6 pr-3">
                    <div className="flex justify-start gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
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
