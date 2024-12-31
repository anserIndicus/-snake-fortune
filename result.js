document.addEventListener('DOMContentLoaded', () => {
    // 从 URL 参数获取运势数据
    const params = new URLSearchParams(window.location.search);
    const fortuneData = JSON.parse(decodeURIComponent(params.get('fortune')));
    
    // 显示问题
    document.getElementById('question-text').textContent = fortuneData.question;
    
    // 显示分数和等级
    document.getElementById('score').textContent = fortuneData.score;
    document.getElementById('level').textContent = fortuneData.level;
    
    // 显示运势描述
    document.getElementById('fortune-message').textContent = fortuneData.phrase;
    
    // 显示选中的灵蛇卡
    const visibleCardSection = document.getElementById('selected-visible-card');
    createCardElement(fortuneData.cards[0], true, visibleCardSection);
    
    // 显示选中的幸运卡
    const hiddenCardsSection = document.getElementById('selected-hidden-cards');
    fortuneData.cards.slice(1).forEach(card => {
        createCardElement(card, false, hiddenCardsSection);
    });
    
    // 设置按钮事件
    setupButtons();
});

function createCardElement(card, isVisible, container) {
    const div = document.createElement('div');
    div.className = `card result-card ${isVisible ? 'visible-card' : 'hidden-card'}`;
    
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
    
    if (isVisible && card.meaning) {
        const meaningDiv = document.createElement('div');
        meaningDiv.className = 'card-meaning';
        meaningDiv.textContent = card.meaning;
        content.appendChild(meaningDiv);
    }
    
    div.appendChild(content);
    container.appendChild(div);
}

function setupButtons() {
    // 分享按钮
    document.getElementById('share-btn').addEventListener('click', () => {
        // TODO: 实现分享功能
        alert('分享功能开发中...');
    });
    
    // 生成壁纸按钮
    document.getElementById('wallpaper-btn').addEventListener('click', () => {
        // TODO: 实现壁纸生成功能
        alert('壁纸生成功能开发中...');
    });
    
    // 重新抽签按钮
    document.getElementById('retry-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
