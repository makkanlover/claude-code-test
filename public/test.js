// 画面回帰テスト
class ScreenRegressionTest {
    constructor() {
        this.testResults = [];
        this.game = null;
    }

    async runAllTests() {
        console.log('=== 画面回帰テスト開始 ===');
        
        // ゲームインスタンスを取得
        this.game = window.jankenGame;
        
        if (!this.game) {
            console.error('ゲームインスタンスが見つかりません');
            return;
        }

        // 各テストを実行
        await this.testStartScreen();
        await this.testGameScreen();
        await this.testResultScreen();
        await this.testScreenTransitions();
        
        // 結果表示
        this.displayResults();
    }

    async testStartScreen() {
        console.log('--- スタート画面テスト ---');
        
        this.game.showScreen('start');
        await this.wait(500);
        
        const result = this.checkScreenVisibility('start-screen', 'スタート画面');
        this.testResults.push(result);
    }

    async testGameScreen() {
        console.log('--- ゲーム画面テスト ---');
        
        this.game.showScreen('game');
        await this.wait(500);
        
        const result = this.checkScreenVisibility('game-screen', 'ゲーム画面');
        this.testResults.push(result);
        
        // ボタンの存在確認
        const buttons = document.querySelectorAll('.choice-btn');
        const buttonTest = {
            name: 'ゲーム画面ボタン',
            passed: buttons.length === 3,
            message: buttons.length === 3 ? 'OK: 選択ボタンが3つ存在' : `NG: 選択ボタンが${buttons.length}個（期待値：3個）`
        };
        this.testResults.push(buttonTest);
    }

    async testResultScreen() {
        console.log('--- 結果画面テスト ---');
        
        // 結果データを設定
        this.game.gameResult = 'win';
        this.game.drawCount = 2;
        this.game.showFinalResult();
        
        this.game.showScreen('result');
        await this.wait(500);
        
        const result = this.checkScreenVisibility('result-screen', '結果画面');
        this.testResults.push(result);
        
        // ボタンの存在確認
        const retryBtn = document.getElementById('retry-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        const buttonTest = {
            name: '結果画面ボタン',
            passed: retryBtn && restartBtn,
            message: (retryBtn && restartBtn) ? 'OK: リトライボタンと最初からボタンが存在' : 'NG: ボタンが見つかりません'
        };
        this.testResults.push(buttonTest);
    }

    async testScreenTransitions() {
        console.log('--- 画面遷移テスト ---');
        
        // start → game
        this.game.showScreen('start');
        await this.wait(200);
        this.game.showScreen('game');
        await this.wait(200);
        
        const transition1 = this.checkScreenVisibility('game-screen', 'start→game遷移');
        this.testResults.push(transition1);
        
        // game → result
        this.game.showScreen('result');
        await this.wait(200);
        
        const transition2 = this.checkScreenVisibility('result-screen', 'game→result遷移');
        this.testResults.push(transition2);
    }

    checkScreenVisibility(screenId, testName) {
        const screen = document.getElementById(screenId);
        
        if (!screen) {
            return {
                name: testName,
                passed: false,
                message: `NG: 画面要素が見つかりません (${screenId})`
            };
        }

        const isActive = screen.classList.contains('active');
        const styles = window.getComputedStyle(screen);
        const isVisible = styles.opacity !== '0' && styles.visibility !== 'hidden';
        
        const passed = isActive && isVisible;
        
        return {
            name: testName,
            passed: passed,
            message: passed ? 'OK: 画面が正常に表示されています' : 
                     `NG: active=${isActive}, opacity=${styles.opacity}, visibility=${styles.visibility}`
        };
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    displayResults() {
        console.log('=== テスト結果 ===');
        
        let passedCount = 0;
        let totalCount = this.testResults.length;
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.message}`);
            
            if (result.passed) passedCount++;
        });
        
        console.log(`\n総合結果: ${passedCount}/${totalCount} テストが成功`);
        
        if (passedCount === totalCount) {
            console.log('🎉 全てのテストが成功しました！');
        } else {
            console.log('⚠️ 一部のテストが失敗しました。修正が必要です。');
        }
    }
}

// テスト実行用の関数をグローバルに公開
window.runScreenTests = function() {
    const tester = new ScreenRegressionTest();
    tester.runAllTests();
};

// 自動テスト実行（開発時のみ）
if (window.location.search.includes('test=true')) {
    setTimeout(() => {
        window.runScreenTests();
    }, 2000);
}