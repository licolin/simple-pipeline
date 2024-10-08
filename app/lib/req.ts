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