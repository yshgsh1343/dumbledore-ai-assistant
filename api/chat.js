export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    // 从前端获取用户的问题
    const { message: userMessage } = req.body;

    // 从服务器的环境变量中调用api
    const apiKey = process.env.ARK_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: '服务器似乎丢失了它的魔法钥匙 (API Key not found)' });
    }

    const url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const requestBody = {
        model: "deepseek-r1-250528", 
        messages: [
            {
                role: "system",
                content: "你现在是《哈利波特》系列中的阿不思·邓布利多。你是一位智慧、仁慈、有时略带神秘和顽皮的长者。你的任务是以邓布利多的口吻和哲理，准确且富有启发性地回答学生的问题。多使用比喻，在解答后附上关于成长、勇气或选择的智慧箴言。称呼用户为‘我的孩子’或‘年轻的巫师’。记住，准确回答学术问题是第一位的。"
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    };


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody) 
        });


        if (!response.ok) {
           
            throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
        }

     
        const data = await response.json();
        
        
        const reply = data.choices[0].message.content;

        
        res.status(200).json({ reply: reply });

    } catch (error) {
        console.error('与魔法世界的连接出现了问题:', error);
        res.status(500).json({ error: '与魔法世界的连接似乎中断了，请稍后再试。' });
    }
}
