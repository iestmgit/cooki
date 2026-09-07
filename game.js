<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نبرد فضایی</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            font-family: 'Arial', sans-serif;
            overflow: hidden;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        
        #gameContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        
        canvas {
            border: 3px solid #00ff88;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }
        
        #ui {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 16px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 100;
            text-align: center;
        }
        
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: #00ff88;
            font-size: 14px;
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 20px;
            border-radius: 20px;
            text-align: center;
            z-index: 100;
        }
        
        #startScreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 200;
            color: white;
        }
        
        #startScreen h1 {
            font-size: 48px;
            color: #00ff88;
            text-shadow: 0 0 20px #00ff88;
            margin-bottom: 30px;
        }
        
        #startScreen button {
            background: linear-gradient(45deg, #00ff88, #00cc66);
            border: none;
            padding: 15px 40px;
            font-size: 20px;
            border-radius: 30px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        #startScreen button:hover {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        }
        
        .playerInfo {
            margin: 15px;
            padding: 10px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #00ff88;
        }
        
        .playerInfo.blue {
            border-color: #00aaff;
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
    </div>
    
    <div id="ui">
        <span id="score1">🟢 بازیکن ۱: ۰</span> | 
        <span id="score2">🔵 بازیکن ۲: ۰</span>
    </div>
    
    <div class="controls">
        🔴 بازیکن ۱: WASD + F (شلیک) | 🔵 بازیکن ۲: جهتنما + Enter (شلیک)
    </div>
    
    <div id="startScreen">
        <h1>⚡ نبرد فضایی ⚡</h1>
        <p style="margin-bottom: 30px; font-size: 18px;">بهترین بازی دو نفره!</p>
        <button onclick="startGame()">🚀 شروع بازی 🚀</button>
    </div>
    
    <script src="game.js"></script>
</body>
</html>
