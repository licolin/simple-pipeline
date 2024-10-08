import type { TransformedOption } from '@/app/ui/pipeline/cascadeOfParams';

type State = {
    name: string;
    code: string;
};

// type Result = {
//     name: string;
//     states: State[];
// };

export function transformData(
    input: Record<string, string[]>,
    reference_map: { [id: string]: string }
): TransformedOption[] {
    return Object.entries(input).map(([key, values]) => {
        const states: State[] = values.map((value) => ({
            name: value,
            code: reference_map[value], // Corrected this line
        }));

        return {
            code: reference_map[key], // Corrected this line
            name: reference_map[key], // Corrected this line
            states,
        } as TransformedOption; // Added 'as TransformedOption'
    });
}


export function getElementsBeforeParam(array: string[], param: string): string[] {
    const index = array.indexOf(param);

    // If the parameter is not in the array, return an empty array
    if (index === -1) {
        return [];
    }

    // Return the elements before the parameter
    return array.slice(0, index);
}

export function getSelectedKeys(
    obj: { [key: string]: string[] },
    keys: string[]
): { [key: string]: string[] } {
    const result: { [key: string]: string[] } = {};

    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });

    return result;
}