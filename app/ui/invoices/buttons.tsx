import {PencilIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {deleteInvoice} from '@/app/lib/actions';

export function CreateInvoice() {
  return (
      <Link
          href="/dashboard/invoices/create"
          className="flex h-8 items-center rounded-sm bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">新建用户</span>{' '}
        <PlusIcon className="h-5 md:ml-4"/>
      </Link>
  );
}

export function CreateProcess() {
  return (
      <Link
          href="/dashboard/processes/create"
          className="mx-1 flex h-8 items-center rounded-sm bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">创建子流程</span>{' '}
        <PlusIcon className="h-5 md:ml-4"/>
      </Link>
  );
}

export function CreatePipeline() {
  return (
      <Link
          href="/dashboard/pipeline/create"
          className="flex h-8 items-center rounded-sm bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">新增流程</span>{' '}
        <PlusIcon className="h-5 md:ml-4"/>
      </Link>
  );
}

export function UpdateInvoice({id}: { id: string }) {
  return (
      <Link
          href={`/dashboard/invoices/${id}/edit`}
          className="rounded-md border p-2 hover:bg-gray-100"
      >
        <PencilIcon className="w-3"/>
      </Link>
  );
}

export function DeleteInvoice({id}: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
      <form action={deleteInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-3"/>
        </button>
      </form>
  );
}


