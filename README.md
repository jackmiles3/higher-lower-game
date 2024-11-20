# 🃏 Higher/Lower Card Game

Welcome to the **Higher/Lower Card Game**, a simple yet engaging card game where players guess whether the next card will be higher or lower than the current one. This project offers two different modes of play and tracks individual statistics for each mode.

## ✨ Features

### 🎮 Game Modes
1. **Streak Mode**
   Try to build the longest streak of correct guesses without making a mistake.  

2. **Timed Mode**
   Choose a time limit (30, 60, or 120 seconds) and try to achieve the highest score by making as many correct guesses as possible within the set time.


### 📈 Difficulty Levels
- **Normal Mode**
  If the next card is of the same rank as the current card, progression is automatic.
  
- **Hard Mode**
  If the next card is of the same rank, you’ll need to guess its suit correctly to progress.


### 📊 Statistics
Track your progress across both game modes and difficulty levels. View your:
- **Highest Score/Streak**  
- **Average Score/Streak**  
- **Total Games Played**  

Statistics are stored locally per user.

### 🖥️ Interactive UI
- **Instructions Panel**  
  Easily accessible from the home page via the top-right button, providing gameplay details.  
- **Settings Menu**  
  Adjust game difficulty and view your statistics via the gear icon on each game page.  

### 🛠️ Technologies Used
- **React**: Core framework for building the app.
- **Tailwind CSS**: A utility-first CSS framework used for designing the UI.
- **Vercel**: For hosting the live version of the game.
- **Icons**: Leveraged  ```react-icons``` for intuitive UI.

## 🔧 Installation and Setup

### ⚙️ Local Development
1. Clone the repository:

```bash
git clone https://github.com/yourusername/higher-lower-card-game.git
cd higher-lower-card-game
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```
The app will run at ```http://localhost:3000```.

### 🚀 Live Deployment
The app is live and hosted on Vercel. You can play it [here](https://higher-lower-game-iota.vercel.app/).

## 🔮 Future Improvements/Additions
- **Multiplayer Mode**: Compete with friends in real-time.
- **Global Leaderboard**: Compare your stats with others.
- **Custom Themes**: Personalize the game's appearance.