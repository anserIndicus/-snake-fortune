const CARDS = {
    visible: [
        { 
            id: 'v1', 
            name: '青蛇', 
            image: 'images/cards/visible/qing-snake.svg', 
            description: '象征智慧、变化和灵性，代表内在觉醒与转变',
            meaning: '提示您需要以智慧和灵活性来应对当前的挑战'
        },
        { 
            id: 'v2', 
            name: '白蛇', 
            image: 'images/cards/visible/white-snake.svg', 
            description: '象征纯洁、治愈和保护，代表净化与守护',
            meaning: '指引您寻求内心的平静，获得精神上的治愈'
        },
        { 
            id: 'v3', 
            name: '银龙', 
            image: 'images/cards/visible/silver-dragon.svg', 
            description: '象征力量、权威和尊贵，代表领导力与影响力',
            meaning: '预示您将在重要领域展现非凡的领导才能'
        },
        { 
            id: 'v4', 
            name: '金蟾', 
            image: 'images/cards/visible/golden-toad.svg', 
            description: '象征财富、繁荣和好运，代表丰盛与机遇',
            meaning: '暗示您在财务或事业上将迎来重要机遇'
        },
        { 
            id: 'v5', 
            name: '如意', 
            image: 'images/cards/visible/ruyi.svg', 
            description: '象征心愿顺利实现，代表吉祥如意',
            meaning: '预示您的愿望将得以实现，事事顺遂'
        },
        { 
            id: 'v6', 
            name: '同心结', 
            image: 'images/cards/visible/love-knot.svg', 
            description: '象征爱情、团结和永恒，代表情感连接',
            meaning: '指引您在感情和人际关系中获得圆满'
        }
    ],
    hidden: [
        {
            id: 'h1',
            name: '灯塔',
            image: 'images/cards/hidden/lighthouse.svg',
            score: 7.5,
            probability: 0.10,
            color: '#FFD700' // 金色
        },
        {
            id: 'h2',
            name: '沙漏',
            image: 'images/cards/hidden/hourglass.svg',
            score: 8.0,
            probability: 0.12,
            color: '#FFD700'
        },
        {
            id: 'h3',
            name: '双鱼玉佩',
            image: 'images/cards/hidden/jade.svg',
            score: 8.5,
            probability: 0.16,
            color: '#90EE90' // 淡绿色
        },
        {
            id: 'h4',
            name: '神秘银币',
            image: 'images/cards/hidden/coin.svg',
            score: 9.0,
            probability: 0.30,
            color: '#90EE90'
        },
        {
            id: 'h5',
            name: '明月光',
            image: 'images/cards/hidden/moonlight.svg',
            score: 9.5,
            probability: 0.20,
            color: '#87CEEB' // 天蓝色
        },
        {
            id: 'h6',
            name: '百鸟朝凤',
            image: 'images/cards/hidden/phoenix.svg',
            score: 10.0,
            probability: 0.12,
            color: '#87CEEB'
        }
    ]
};

function calculateFortuneScore(selectedCards) {
    // 检查是否为豹子（三张相同的卡）
    if (selectedCards[0].id === selectedCards[1].id && selectedCards[1].id === selectedCards[2].id) {
        return 99;
    }
    
    // 计算普通得分
    const card1Score = CARDS.hidden.find(c => c.id === selectedCards[0].id).score;
    const card2Score = CARDS.hidden.find(c => c.id === selectedCards[1].id).score;
    const card3Score = CARDS.hidden.find(c => c.id === selectedCards[2].id).score;
    
    return Math.round((card1Score + card2Score) * card3Score);
}

// 根据概率随机抽取一张卡
function drawRandomCard() {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const card of CARDS.hidden) {
        cumulativeProbability += card.probability;
        if (random < cumulativeProbability) {
            return { ...card };
        }
    }
    
    // 保底返回最后一张卡
    return { ...CARDS.hidden[CARDS.hidden.length - 1] };
}

const FORTUNE_LEVELS = {
    MEDIUM: { min: 65, max: 74, name: '中吉' },
    GREAT: { min: 75, max: 84, name: '大吉' },
    EXCELLENT: { min: 85, max: 98, name: '上吉' },
    SUPREME: { min: 99, max: 99, name: '上上吉' }
};

function getFortuneLevel(score) {
    if (score >= FORTUNE_LEVELS.SUPREME.min) return FORTUNE_LEVELS.SUPREME;
    if (score >= FORTUNE_LEVELS.EXCELLENT.min) return FORTUNE_LEVELS.EXCELLENT;
    if (score >= FORTUNE_LEVELS.GREAT.min) return FORTUNE_LEVELS.GREAT;
    if (score >= FORTUNE_LEVELS.MEDIUM.min) return FORTUNE_LEVELS.MEDIUM;
    return { name: '吉', min: 64, max: 64 };
}

const FORTUNE_PHRASES = [
    "金麟岂是池中物",
    "一朝化龙上青天",
    "福星高照喜事临",
    "事业有成步步高",
    "前程似锦展宏图",
    "万事如意福满堂"
];

function generateFortune(selectedCards, score, question) {
    const level = getFortuneLevel(score);
    const phrase = FORTUNE_PHRASES[Math.floor(Math.random() * FORTUNE_PHRASES.length)];
    
    return {
        score: score,
        level: level.name,
        phrase: phrase,
        cards: selectedCards,
        interpretation: generateInterpretation(selectedCards, score, question),
        advice: generateAdvice(score, level)
    };
}

function generateInterpretation(cards, score, question) {
    // 这里可以根据卡片组合、分数和问题生成更详细的解释
    return `根据您抽到的卡片组合，显示您的运势非常理想。
    ${cards[0].name}卡暗示着...（具体解释）
    ${cards.slice(1).map(card => card.name).join('+')}的组合表明...（具体解释）`;
}

function generateAdvice(score, level) {
    return [
        "把握机遇，主动出击",
        "保持谦逊，稳扎稳打",
        "与贵人多多交流，广结善缘"
    ];
}
