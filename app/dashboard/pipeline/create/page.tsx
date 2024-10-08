// @ts-ignore
import { fetchCustomers } from '@/app/lib/data.ts';
import Form from '@/app/ui/pipeline/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '新建流程',
};

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <div className="pt-2">
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: '流程集合', href: '/dashboard/pipeline' },
                        {
                            label: '新建流程',
                            href: '/dashboard/pipeline/create',
                            active: true,
                        },
                    ]}
                />
                <Form customers={customers} />
            </main>
        </div>
    );
}
