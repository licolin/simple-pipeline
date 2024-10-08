'use server';

import { z } from 'zod';
import { Client } from 'pg';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {signIn, signOut} from '@/auth';
import { AuthError } from 'next-auth';
import { Pool } from 'pg';
// import create from "zustand";
// require('dotenv').config();

// console.log("uuuuu "+process.env.POSTGRES_URL);
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// interface FormState {
//   codeEditorData: string;
//   textareaData: string;
//   // dynamicFormData: { name: string; value: string }[];
//   setCodeEditorData: (data: string) => void;
//   setTextareaData: (data: string) => void;
//   // setDynamicFormData: (data: { name: string; value: string }[]) => void;
//   submitForm: () => Promise<void>;
// }


// export const useFormStore = create<FormState>((set, get) => ({
//   codeEditorData: '',
//   textareaData: '',
//   // dynamicFormData: [],
//   setCodeEditorData: (data) => set({ codeEditorData: data }),
//   setTextareaData: (data) => set({ textareaData: data }),
//   // setDynamicFormData: (data) => set({ dynamicFormData: data }),
//   submitForm: async () => {
//     // const { codeEditorData, textareaData, dynamicFormData } = get();
//     const { codeEditorData, textareaData } = get();
//
//     console.log("codeEditorData "+codeEditorData)
//     console.log("textareaData "+textareaData)
//     try {
//       // Insert the form data into the PostgreSQL database
//       // await pool.query(
//       //     'INSERT INTO form_data (code_editor_data, textarea_data) VALUES ($1, $2)',
//       //     [codeEditorData, textareaData]
//       // );
//
//       console.log('Form data submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form data:', error);
//     }
//   },
// }));


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};


export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Use the pool to query the database
  try {
    await pool.query(
        `
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ($1, $2, $3, $4)
    `,
        [customerId, amountInCents, status, date]
    );
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.log(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  // Connect to the database
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();

  try {
    await client.query(
        `
      UPDATE invoices
      SET customer_id = $1, amount = $2, status = $3
      WHERE id = $4
    `,
        [customerId, amountInCents, status, id]
    );
  } catch (error) {
    console.log(error);
    return { message: 'Database Error: Failed to Update Invoice.' };
  } finally {
    // Disconnect from the database
    await client.end();
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // Connect to the database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  try {
    await client.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  } finally {
    // Disconnect from the database
    await client.end();
  }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export async function LogOut(){
  "use server";
  await signOut();
}