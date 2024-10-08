'use client';

import { CustomerField,FormErrors } from '@/app/lib/definitions';
import Link from 'next/link';
import {
    AtSymbolIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import React, {useState} from "react";
import {useSession} from "next-auth/react";

export default function Form({ customers }: { customers: CustomerField[] }) {
    const {data: session, status} = useSession();
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        message: null,
        errors: {name:[], description:[]},
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form fields
        const  errors:FormErrors={name: [],description:[]}
        let msg = "";
        if (!formState.name.trim()) {
            errors.name = ['流程名称不能为空'];
            // msg = '流程名称不能为空';
        }
        if (!formState.description.trim()) {
            errors.description = ['流程描述不能为空'];
            // msg = '流程描述不能为空';
        }
        if (Object.values(errors).some((field) => field.length > 0)) {
            // @ts-ignore
            setFormState((prevState) => ({
                ...prevState,
                errors,
            }));
            return;
        }

        const formData = {
            name: formState.name,
            description: formState.description,
        };
        console.log("formData is "+formData);
        try {
            const response = await fetch('/api/pipeline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'createPipeline',
                    name: formData.name,
                    description:formData.description,
                    create_user:session?.user?.email,
                }),
            });
            const result = await response.json();
            if (result.success) {
                // @ts-ignore
                setFormState((formState) => ({
                    ...formState,
                    message: '创建成功',
                    errors: {},
                }));
            } else {
                setFormState((formState) => ({
                    ...formState,
                    message: result.error || '创建失败',
                    errors: result.error || {},
                }));

            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

    };



    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        流程名称
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formState.name}
                                onChange={handleInputChange}
                                step="0.01"
                                placeholder="填写流程名称"
                                className="peer block w-full rounded-sm border border-gray-200 py-1.5 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="amount-error"
                            />
                            <AtSymbolIcon
                                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>

                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {formState.errors?.name &&
                            formState.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        流程描述
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="description"
                                name="description"
                                type="text"
                                value={formState.description}
                                onChange={handleInputChange}
                                step="0.01"
                                placeholder="填写流程描述"
                                className="peer block w-full rounded-sm border border-gray-200 py-1.5 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="amount-error"
                            />
                            <AtSymbolIcon
                                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>

                    <div id="amount-error" aria-live="polite" aria-atomic="true">
                        {formState.errors?.description &&
                            formState.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {formState.message ? (
                        <p className="mt-2 text-sm text-red-500">{formState.message}</p>
                    ) : null}
                </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
                <Link
                    href="/dashboard/pipeline"
                    className="flex h-8 items-center rounded-sm bg-gray-300 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-500"
                >
                    取消
                </Link>
                <Button className="rounded-sm h-8 text-sm" type="submit">创建流程</Button>
            </div>
        </form>
    );
}
