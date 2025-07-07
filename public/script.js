class JankenGame {
    constructor() {
        this.drawCount = 0;
        this.currentScreen = 'start';
        this.playerChoice = null;
        this.cpuChoice = null;
        this.gameResult = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('start');
    }
    
    bindEvents() {
        // スタートボタン
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('game');
        });
        
        // じゃんけん選択ボタン
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playRound(choice);
            });
        });
        
        // 続けるボタン
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.resetRound();
        });
        
        // リトライボタン
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.retryGame();
        });
        
        // リスタートボタン
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    showScreen(screenName) {
        console.log(`画面切り替え: ${this.currentScreen} → ${screenName}`);
        
        // 全ての画面を非アクティブにする
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 少し遅延を入れて新しい画面を表示
        setTimeout(() => {
            const targetScreen = document.getElementById(`${screenName}-screen`);
            if (targetScreen) {
                targetScreen.classList.add('active');
                this.currentScreen = screenName;
                console.log(`画面切り替え完了: ${screenName}`);
            } else {
                console.error(`画面が見つかりません: ${screenName}-screen`);
            }
        }, 100);
    }
    
    playRound(playerChoice) {
        this.playerChoice = playerChoice;
        this.cpuChoice = this.getCpuChoice();
        
        // 選択を表示
        this.displayChoices();
        
        // 勝敗判定
        const result = this.determineWinner();
        
        if (result === 'draw') {
            this.drawCount++;
            this.showRoundResult('あいこです！もう一度選んでください', 'draw');
        } else {
            this.gameResult = result;
            this.showRoundResult(result === 'win' ? 'あなたの勝ちです！' : 'あなたの負けです！', result);
            
            // 結果画面へ遷移
            setTimeout(() => {
                this.transitionToResult();
            }, 2000);
        }
    }
    
    getCpuChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }
    
    displayChoices() {
        const playerDisplay = document.getElementById('player-choice-display');
        const cpuDisplay = document.getElementById('cpu-choice-display');
        
        playerDisplay.textContent = this.getChoiceEmoji(this.playerChoice);
        cpuDisplay.textContent = this.getChoiceEmoji(this.cpuChoice);
        
        document.getElementById('battle-result').classList.remove('hidden');
    }
    
    getChoiceEmoji(choice) {
        const emojis = {
            rock: '✊',
            paper: '✋',
            scissors: '✌️'
        };
        return emojis[choice];
    }
    
    getChoiceText(choice) {
        const texts = {
            rock: 'グー',
            paper: 'パー',
            scissors: 'チョキ'
        };
        return texts[choice];
    }
    
    determineWinner() {
        if (this.playerChoice === this.cpuChoice) {
            return 'draw';
        }
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[this.playerChoice] === this.cpuChoice ? 'win' : 'lose';
    }
    
    showRoundResult(message, result) {
        const roundResult = document.getElementById('round-result');
        roundResult.textContent = message;
        
        // 結果に応じて色を変更
        if (result === 'win') {
            roundResult.style.color = '#27ae60';
        } else if (result === 'lose') {
            roundResult.style.color = '#e74c3c';
        } else {
            roundResult.style.color = '#f39c12';
        }
        
        // あいこの場合は続けるボタンを表示
        if (result === 'draw') {
            document.getElementById('continue-btn').classList.remove('hidden');
        }
    }
    
    transitionToResult() {
        console.log('結果画面に遷移中...');
        
        // 結果データを設定
        this.showFinalResult();
        
        // 画面遷移
        setTimeout(() => {
            this.showScreen('result');
            
            // 結果画面の背景を確実に設定
            setTimeout(() => {
                const resultScreen = document.getElementById('result-screen');
                if (resultScreen) {
                    resultScreen.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                    resultScreen.style.color = 'white';
                    console.log('結果画面のスタイルを強制適用');
                }
            }, 100);
        }, 200);
    }
    
    showFinalResult() {
        const finalResult = document.getElementById('final-result');
        const drawCount = document.getElementById('draw-count');
        
        if (!finalResult || !drawCount) {
            console.error('結果画面の要素が見つかりません');
            return;
        }
        
        console.log('結果表示中:', this.gameResult, 'あいこ回数:', this.drawCount);
        
        if (this.gameResult === 'win') {
            finalResult.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <div style="color: #27ae60; font-weight: bold;">あなたの勝利！</div>
            `;
        } else {
            finalResult.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
                <div style="color: #e74c3c; font-weight: bold;">あなたの負け</div>
            `;
        }
        
        drawCount.textContent = `あいこ回数: ${this.drawCount}回`;
    }
    
    resetRound() {
        document.getElementById('battle-result').classList.add('hidden');
        document.getElementById('continue-btn').classList.add('hidden');
        document.getElementById('round-result').textContent = '';
    }
    
    retryGame() {
        // あいこ回数はリセットしない
        this.playerChoice = null;
        this.cpuChoice = null;
        this.gameResult = null;
        
        this.resetRound();
        this.showScreen('game');
    }
    
    resetGame() {
        this.drawCount = 0;
        this.playerChoice = null;
        this.cpuChoice = null;
        this.gameResult = null;
        
        this.resetRound();
        this.showScreen('start');
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    window.jankenGame = new JankenGame();
});