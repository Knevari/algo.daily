
interface PistonResponse {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        output: string;
        code: number;
        signal: string | null;
    };
}

export async function executePiston(language: string, version: string, content: string): Promise<PistonResponse> {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            language,
            version,
            files: [
                {
                    content,
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`Piston API Error: ${response.statusText}`);
    }

    return response.json();
}
