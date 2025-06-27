// 文件路径: /api/chat.js
// 这段代码是为Vercel的Node.js环境准备的

export default async function handler(req, res) {
    // 确保我们只处理POST请求，就像只回应正确的敲门暗号
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    // 从前端获取用户的问题
    const { message: userMessage } = req.body;

    // 从服务器的环境变量中安全地取出你的秘密钥匙
    // 你需要在Vercel的项目设置中，将你的API Key命名为 ARK_API_KEY 并保存
    const apiKey = process.env.ARK_API_KEY;

    // 如果钥匙不存在，魔法就无法施展
    if (!apiKey) {
        return res.status(500).json({ error: '服务器似乎丢失了它的魔法钥匙 (API Key not found)' });
    }

    // --- 这里是我们将你的 `curl` 命令翻译成 JavaScript 的核心部分 ---

    // 1. 魔法精灵的地址
    const url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

    // 2. 我们的请求内容，包含了邓布利多的灵魂指令！
    const requestBody = {
        model: "deepseek-r1-250528", // 你可以使用你指定的 deepseek-r1-250528 或更新的 deepseek-v2
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

    // 3. 使用 `fetch` 施展网络魔法
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // 注意这里的格式，完全复刻了curl命令
            },
            body: JSON.stringify(requestBody) // 将我们的请求内容打包成JSON字符串
        });

        // 如果魔法精灵没有回应，我们也需要知道
        if (!response.ok) {
            // 抛出一个错误，这样我们就能在下面的catch中捕获到更详细的信息
            throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
        }

        // 解析魔法精灵返回的智慧
        const data = await response.json();
        
        // 从返回的数据中，取出真正的回答
        const reply = data.choices[0].message.content;

        // 将智慧传递回前端的魔法画框
        res.status(200).json({ reply: reply });

    } catch (error) {
        console.error('与魔法世界的连接出现了问题:', error);
        res.status(500).json({ error: '与魔法世界的连接似乎中断了，请稍后再试。' });
    }
}
