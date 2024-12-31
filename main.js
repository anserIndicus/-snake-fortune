let selectedVisibleCard = null;
let selectedVisibleCardData = null;
let selectedHiddenCards = [];
const MAX_HIDDEN_CARDS = 3;
const DEFAULT_QUESTION = "2025蛇年我的整体运势如何？";

document.addEventListener('DOMContentLoaded', () => {
    initializeCards();
    setupEventListeners();
    
    // 设置默认问题
    document.getElementById('question').placeholder = DEFAULT_QUESTION;
});

function initializeCards() {
    // 初始化明牌区域
    const visibleCardsContainer = document.getElementById('visible-cards');
    CARDS.visible.forEach(card => {
        const cardElement = createCardElement(card, true);
        visibleCardsContainer.appendChild(cardElement);
    });

    // 初始化暗牌区域
    const hiddenCardsContainer = document.getElementById('hidden-cards');
    // 创建三组暗牌，每组3张
    const groupColors = ['#FFD700', '#90EE90', '#87CEEB']; // 金色、淡绿色、天蓝色
    
    for (let group = 0; group < 3; group++) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'cards-group';
        groupDiv.style.setProperty('--group-color', groupColors[group]);
        
        // 创建装饰性的窗花元素
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄️';
        groupDiv.appendChild(snowflake);
        
        // 创建3x1的卡片布局
        const gridDiv = document.createElement('div');
        gridDiv.className = 'cards-grid';
        
        // 在每个组中放置3张牌背
        for (let i = 0; i < 3; i++) {
            const cardElement = createHiddenCardElement();
            gridDiv.appendChild(cardElement);
        }
        
        groupDiv.appendChild(gridDiv);
        hiddenCardsContainer.appendChild(groupDiv);
    }
}

function createCardElement(card, isVisible) {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.id = card.id;
    div.dataset.name = card.name;
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    content.appendChild(img);
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'card-name';
    nameDiv.textContent = card.name;
    content.appendChild(nameDiv);
    
    div.appendChild(content);
    
    div.addEventListener('click', () => {
        if (isVisible) {
            handleVisibleCardSelection(div, card);
        }
    });
    
    return div;
}

function createHiddenCardElement() {
    const div = document.createElement('div');
    div.className = 'card hidden-card';
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const img = document.createElement('img');
    img.src = 'images/cards/card-back.svg';
    img.alt = '幸运卡';
    content.appendChild(img);
    
    div.appendChild(content);
    
    div.addEventListener('click', () => {
        if (div.classList.contains('selected')) {
            // 取消选择
            div.classList.remove('selected');
            selectedHiddenCards = selectedHiddenCards.filter(card => card.element !== div);
        } else if (selectedHiddenCards.length < MAX_HIDDEN_CARDS) {
            // 选择卡片
            div.classList.add('selected');
            const drawnCard = drawRandomCard();
            selectedHiddenCards.push({
                element: div,
                card: drawnCard
            });
        }
        updateSubmitButton();
    });
    
    return div;
}

function updateSubmitButton() {
    const submitButton = document.getElementById('submit-fortune');
    if (selectedHiddenCards.length === MAX_HIDDEN_CARDS) {
        submitButton.classList.add('active');
        submitButton.textContent = '完成～查收我的新年好运';
    } else {
        submitButton.classList.remove('active');
        submitButton.textContent = `还需选择${MAX_HIDDEN_CARDS - selectedHiddenCards.length}张幸运卡`;
    }
}

function handleVisibleCardSelection(element, card) {
    if (element.classList.contains('selected')) {
        // 取消选择
        element.classList.remove('selected');
        selectedVisibleCard = null;
        selectedVisibleCardData = null;
    } else {
        // 选择新卡片
        if (selectedVisibleCard) {
            selectedVisibleCard.classList.remove('selected');
        }
        element.classList.add('selected');
        selectedVisibleCard = element;
        selectedVisibleCardData = card;
    }
    updateSubmitButton();
}

function handleFortuneSubmission() {
    if (!validateCardSelection()) {
        return;
    }

    // 显示选中的卡片
    selectedHiddenCards.forEach(({element, card}) => {
        const content = element.querySelector('.card-content');
        const img = content.querySelector('img');
        img.src = card.image;
        img.alt = card.name;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'card-name';
        nameDiv.textContent = card.name;
        content.appendChild(nameDiv);
    });

    const question = document.getElementById('question').value || DEFAULT_QUESTION;
    const score = calculateFortuneScore(selectedHiddenCards.map(item => item.card));
    const fortune = generateFortune(
        [selectedVisibleCardData, ...selectedHiddenCards.map(item => item.card)],
        score,
        question
    );
    
    displayFortuneResult(fortune);
    scrollToResult();
}

function validateCardSelection() {
    if (!selectedVisibleCard) {
        alert('请选择一张灵蛇卡！');
        return false;
    }
    
    if (selectedHiddenCards.length !== MAX_HIDDEN_CARDS) {
        alert('请选择三张暗牌！');
        return false;
    }
    
    return true;
}

function displayFortuneResult(fortune) {
    const resultSection = document.getElementById('result');
    resultSection.style.display = 'block';

    document.getElementById('score').textContent = fortune.score;
    document.getElementById('level').textContent = fortune.level;
    document.getElementById('fortune-message').textContent = fortune.phrase;

    // 显示选中的卡片
    const selectedCardsContainer = document.querySelector('.selected-cards');
    selectedCardsContainer.innerHTML = '';
    
    // 创建明牌展示
    const visibleCardDiv = createResultCard(fortune.cards[0], true);
    selectedCardsContainer.appendChild(visibleCardDiv);
    
    // 创建暗牌展示
    const hiddenCardsDiv = document.createElement('div');
    hiddenCardsDiv.className = 'hidden-cards-result';
    fortune.cards.slice(1).forEach(card => {
        const cardDiv = createResultCard(card, false);
        hiddenCardsDiv.appendChild(cardDiv);
    });
    selectedCardsContainer.appendChild(hiddenCardsDiv);
    
    // 滚动到结果区域
    scrollToResult();
}

function createResultCard(card, isVisible) {
    const div = document.createElement('div');
    div.className = 'card result-card';
    if (isVisible) {
        div.classList.add('visible-card');
    } else {
        div.classList.add('hidden-card');
    }
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    content.appendChild(img);
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'card-name';
    nameDiv.textContent = card.name;
    content.appendChild(nameDiv);
    
    div.appendChild(content);
    return div;
}

function scrollToResult() {
    const resultSection = document.getElementById('result');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function setupEventListeners() {
    // 步骤1的按钮
    document.getElementById('next-step1').addEventListener('click', () => {
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    });
    
    // 步骤2的按钮
    document.getElementById('prev-step2').addEventListener('click', () => {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
    });
    
    document.getElementById('next-step2').addEventListener('click', () => {
        if (!selectedVisibleCard) {
            alert('请选择一张灵蛇卡！');
            return;
        }
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
    });
    
    // 步骤3的按钮
    document.getElementById('prev-step3').addEventListener('click', () => {
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    });
    
    // 提交按钮
    document.getElementById('submit-fortune').addEventListener('click', handleFortuneSubmission);

    const shareInterpretationButton = document.getElementById('share-interpretation');
    shareInterpretationButton.addEventListener('click', handleShare);

    const shareWallpaperButton = document.getElementById('share-wallpaper');
    shareWallpaperButton.addEventListener('click', handleWallpaperShare);
    
    // Add retry button handler
    document.getElementById('retry-fortune').addEventListener('click', () => {
        // Reset selections
        selectedVisibleCard = null;
        selectedVisibleCardData = null;
        selectedHiddenCards = [];
        
        // Reset UI
        if (selectedVisibleCard) {
            selectedVisibleCard.classList.remove('selected');
        }
        document.querySelectorAll('.hidden-card').forEach(card => {
            card.classList.remove('selected');
            const img = card.querySelector('img');
            img.src = 'images/cards/card-back.svg';
            img.alt = '幸运卡';
            const nameDiv = card.querySelector('.card-name');
            if (nameDiv) {
                nameDiv.remove();
            }
        });
        
        // Reset question input
        document.getElementById('question').value = '';
        
        // Hide result and show first step
        document.getElementById('result').style.display = 'none';
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
}

function handleShare() {
    // 实现分享功能，获取详细解签
    alert('分享成功！正在跳转到详细解签页面...');
    // 这里可以添加实际的分享逻辑和跳转
}

function handleWallpaperShare() {
    // 实现分享获取桌面壁纸功能
    alert('分享成功！正在生成您的专属提运桌面...');
    // 这里可以添加实际的壁纸生成逻辑
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

function calculateFortuneScore(hiddenCards) {
    // 检查是否为豹子（三张相同的卡）
    if (hiddenCards[0].name === hiddenCards[1].name && hiddenCards[1].name === hiddenCards[2].name) {
        return 99;
    }
    
    // 根据公式计算：三张卡分数的平均值 * 10
    const avgScore = (hiddenCards[0].score + hiddenCards[1].score + hiddenCards[2].score) / 3;
    const finalScore = Math.round(avgScore * 10);
    
    // 确保分数在62-98之间
    return Math.min(98, Math.max(62, finalScore));
}

function generateFortune(selectedCards, score, question) {
    // 根据分数确定运势等级（62～99分）
    let level, phrase;
    
    if (score >= 99) {
        level = '上上吉';
        phrase = '福星高照，万事顺遂！这一年将会有非常好的发展机遇，必定收获满满。';
    } else if (score >= 90) {
        level = '上吉';
        phrase = '运势昌隆，诸事皆顺！期待一个充满希望的新年，好运连连。';
    } else if (score >= 80) {
        level = '大吉';
        phrase = '平稳向上，渐入佳境。保持积极心态，必有好事发生。';
    } else if (score >= 70) {
        level = '中吉';
        phrase = '稳中有进，循序渐进。踏实前行，终会收获满满。';
    } else {
        level = '平';
        phrase = '平平稳稳，宜守不宜进。稳扎稳打，静待花开。';
    }
    
    return {
        score: score,
        level: level,
        phrase: phrase,
        cards: selectedCards
    };
}
