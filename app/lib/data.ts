import {Pool} from 'pg';
import {
    CustomerField,
    CustomersTableType,
    InvoiceForm,
    InvoicesTable,
    LatestInvoiceRaw,
    Revenue,
    User,
    PythonScript, ProcessTable, Pipelines, NodeEdge,Posts
} from './definitions';
import {formatCurrency} from './utils';
import {unstable_noStore as noStore} from 'next/cache';

console.log("process.env.POSTGRES_URL "+process.env.POSTGRES_URL);
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export async function fetchRevenue() {
    noStore();
    try {
        // Artificially delay a response for demo purposes.
        // Don't do this in production :)

        // console.log('Fetching revenue data...');
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        const { rows } = await pool.query<Revenue>(`SELECT * FROM revenue`);

        // console.log('Data fetch completed after 3 seconds.');

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchPostTitle(
    username: string,
) {
    noStore();
    try {
        const { rows } = await pool.query<Posts>(`SELECT title, username, MAX(insert_time) AS latest_time
            FROM t_posts 
            WHERE username = $1
            GROUP BY title, username
            ORDER BY latest_time DESC LIMIT 15`,[username]);
        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
    noStore();
    try {
        const { rows } = await pool.query<LatestInvoiceRaw>(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `);

        return rows.map((invoice) => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchCardData() {
    noStore();
    try {
        const [invoiceCountResult, customerCountResult, userResult,liveUserResult] = await Promise.all([
            pool.query<{ count: string }>(`SELECT COUNT(*) FROM python_scripts`),
            pool.query<{ count: string }>(`SELECT COUNT(*) FROM pipelines`),
            pool.query<{ count: string }>(`SELECT COUNT(*) FROM users`),
            pool.query<{ count: string }>(`SELECT COUNT(*) FROM users`),
        ]);

        const numberOfProcess = Number(invoiceCountResult.rows[0].count ?? '0');
        const numberOfPipeline = Number(customerCountResult.rows[0].count ?? '0');
        // @ts-ignore
        const userCountResult = Number(userResult.rows[0].count ?? '0');
        // @ts-ignore
        const liveUserCountResult = Number(liveUserResult.rows[0].count ?? '0');

        return {
            numberOfProcess,
            numberOfPipeline,
            userCountResult,
            liveUserCountResult,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const { rows } = await pool.query<InvoicesTable>(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
      ORDER BY invoices.date DESC
      LIMIT $2 OFFSET $3
    `, [`%${query}%`, ITEMS_PER_PAGE, offset]);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function fetchInvoicesPages(query: string) {
    noStore();
    try {
        const { rows } = await pool.query(`
    SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE $1 OR
      customers.email ILIKE $1 OR
      invoices.amount::text ILIKE $1 OR
      invoices.date::text ILIKE $1 OR
      invoices.status ILIKE $1
  `, [`%${query}%`]);

        const totalPages = Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    }
}

export async function fetchPipelinePage(query: string) {
    noStore();
    try {
        const { rows } = await pool.query(`
    SELECT COUNT(*)
    FROM pipelines
    WHERE
      pipelines.name ILIKE $1 OR
      pipelines.creator ILIKE $1 OR
      pipelines.description::text ILIKE $1 OR
      pipelines.create_time::text ILIKE $1
  `, [`%${query}%`]);

        const totalPages = Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    }
}

export async function fetchFilteredPipelines(
    query: string,
    currentPage: number,
) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const { rows } = await pool.query<Pipelines>(`
      SELECT
        pipelines.id,
        pipelines.name,
        pipelines.creator,
        pipelines.create_time,
        pipelines.active,
        pipelines.description
      FROM pipelines
      WHERE
        pipelines.name ILIKE $1 OR
        pipelines.creator ILIKE $1 OR
        pipelines.create_time::text ILIKE $1 OR
        pipelines.description::text ILIKE $1 OR
        CAST(pipelines.active AS text) ILIKE $1
      ORDER BY pipelines.create_time DESC
      LIMIT $2 OFFSET $3
    `, [`%${query}%`, ITEMS_PER_PAGE, offset]);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}


export async function fetchFilteredProcesses(
    query: string,
) {
    noStore();
    // const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const { rows } = await pool.query<ProcessTable>(`
      SELECT
        python_scripts.id,
        python_scripts.script_name,
        python_scripts.description
      FROM python_scripts
      WHERE
        python_scripts.id::text ILIKE $1 OR
        python_scripts.script_name ILIKE $1 OR
        python_scripts.description::text ILIKE $1
    `, [`%${query}%`]);

        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch processes.');
    }
}


export async function fetchInvoiceById(id: string) {
    noStore();
    try {
        const { rows } = await pool.query<InvoiceForm>(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = $1;
    `, [id]);

        const [invoice] = rows.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            amount: invoice.amount / 100,
        }));

        return invoice;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
    }
}

export async function fetchCustomers() {
    try {
        const { rows } = await pool.query<CustomerField>(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

        return rows;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchFilteredCustomers(query: string) {
    noStore();
    try {
        const { rows } = await pool.query<CustomersTableType>(`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE $1 OR
        customers.email ILIKE $1
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `, [`%${query}%`]);

        const customers = rows.map((customer) => ({
            ...customer,
            total_pending: formatCurrency(customer.total_pending),
            total_paid: formatCurrency(customer.total_paid),
        }));

        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
}

export async function getUser(email: string) {
    try {
        const { rows } = await pool.query<User>(`SELECT * FROM users WHERE email=$1`, [email]);
        return rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function fetchScript(id: string) {
    try {
        const { rows } = await pool.query<PythonScript>(`SELECT * FROM python_scripts WHERE id=$1`, [id]);
        return rows[0];
    } catch (error) {
        console.error('Failed to fetch scripts:', error);
        throw new Error('Failed to fetch scripts.');
    }
}

export async function fetchNodeEdge(id: string) {
    try {
        const { rows } = await pool.query<NodeEdge>(`SELECT * FROM pipelines WHERE id=$1`, [id]);
        return rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}