import {NextResponse} from 'next/server';

interface PwdDict {
    userId: string;
    password: string;
}

export async function POST(request: Request) {
    const question = await request.json();
    console.log("question information " + JSON.stringify(question));

    // User credentials for login
    const pwdDict: PwdDict = {
        userId: process.env.USER_ID as string, // Store in .env file
        password: process.env.PASSWORD as string, // Store in .env file
    };

    try {
        // Step 1: Log in and get token
        const token = await loginPlatform(pwdDict);

        if (!token) {
            return NextResponse.json({error: 'Login failed'}, {status: 500});
        }

        // Step 2: Invoke code generation API
        const response = await invokeGenerateCode(token, question["content"]);

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}

// Function to log in to the platform and retrieve token
async function loginPlatform({userId, password}: PwdDict): Promise<string> {
    const host = 'https://csgl.gtja.net';
    const loginUrl = `${host}/csgl-api/user/login`;

    const loginData = {
        userId,
        password,
    };

    const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(loginData),
    });

    const loginJson = await loginResponse.json();

    if (loginJson.code === '000000000') {
        console.log(`User ${userId} logged in successfully.`);
        return loginJson.data.token;
    } else {
        throw new Error(`User ${userId} failed to log in.`);
    }
}

// Function to invoke the code generation API
async function invokeGenerateCode(token: string, question: string) {
    const host = 'https://csgl.gtja.net';
    const codeGenerateUrl = `${host}/csgl-ai/api/local_doc_chat`;

    const reqContents = {
        question: question,
        questioner: 'lizhaohuan026901', // Replace with your user ID if needed
    };

    console.log("reqContents is "+JSON.stringify(reqContents));
    const codeResponse = await fetch(codeGenerateUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'token':token, // Pass token in the header
        },
        body: JSON.stringify(reqContents),
    });

    return await codeResponse.json();
}
