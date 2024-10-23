interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const fetchNodeEdge = async (id: string) => {
    try {
        const response = await fetch(`/api/pipeline?id=${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch params for node ${id}`);
        }
        const data = await response.json();
        return data.success ? data.data.params : null;
    } catch (error) {
        console.error('Error fetching params:', error);
        return null;
    }
};

export default fetchNodeEdge;


export const insertMessage = async (username: string | null, title: string, botMessage: Message) => {
    if (!username) throw new Error('Username is required');

    try {
        const response = await fetch('/api/chat/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                title,
                message: botMessage,
            }),
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error('Failed to insert message');
        }

        return data;
    } catch (error) {
        console.error('Error inserting message:', error);
        throw error; // Re-throw the error to handle it where the function is called
    }
};