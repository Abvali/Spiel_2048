# Implementierungsplan - Game2048 Klassen-Refactoring

Dieser Plan beschreibt die Schritte, um den bestehenden funktionalen Code von `js/app.js` in eine strukturierte `Game2048`-Klasse zu kapseln.

## Ziel
Umwandlung der globalen Variablen und eigenständigen Funktionen in `js/app.js` in eine zusammenhängende `Game2048`-Klasse. Dies verbessert die Code-Organisation, ermöglicht mehrere Spielinstanzen und behebt Probleme mit der Scope-Verschmutzung.

## Vorgeschlagene Klassenstruktur

Ich werde eine neue Datei `js/Game2048.js` erstellen (oder `js/app.js` ersetzen) mit folgender Struktur:

```javascript
class Game2048 {
  constructor(elementSelector) {
    this.rows = 4;
    this.columns = 4;
    this.score = 0;
    this.bestScore = localStorage.getItem("bestScore") || 0;
    this.board = [];
    this.gameState = "playing"; // playing, paused, gameover
    this.container = document.querySelector(elementSelector);
    
    // Methoden binden falls nötig
    this.handleInput = this.handleInput.bind(this);
  }

  init() {
    this.createBoard();
    this.setupEventListeners();
    this.startTimer();
  }

  createBoard() {
    // Logik zur Initialisierung des Boards (war createBoard)
  }

  addRandomTile() {
    // Logik eine Kachel hinzuzufügen (war addNum)
  }

  // Bewegungslogik
  move(direction) {
    // Vereinheitlichter Move-Handler, der spezifische Richtungs-Methoden aufruft
  }
  
  moveLeft() { ... }
  moveRight() { ... }
  moveUp() { ... }
  moveDown() { ... }

  // Rendering
  render() {
    // Logik zur Aktualisierung des DOM (war renderBoard)
  }

  // Hilfsmethoden
  transpose(matrix) { ... }
}

// Verwendung
const game = new Game2048("#board");
game.init();
```

## Erforderliche Änderungen

### [js/app.js](file:///home/sebtro/DEVOPS/repos/maryam/Spiel_2048/js/app.js)

1.  **Logik kapseln**: Verschieben aller `let`-Variablen (`board`, `score`, `timerInterval`, usw.) in den `constructor`.
2.  **Funktionen refactorn**: Konvertieren von Funktionen wie `createBoard`, `twoOrFour`, `slideLeft` in Klassenmethoden.
3.  **DOM-Referenzen aktualisieren**: Statt Selektoren wie `#board` überall hart zu codieren, verwenden Sie `this.container` oder scoped Lookups.
4.  **Event-Listener**: Verschieben der globalen Event-Listener in eine `setupEventListeners`-Methode innerhalb der Klasse.

## Verifizierungsplan

### Manuelle Verifizierung
1.  Browser neu laden.
2.  Überprüfen, ob das Board korrekt initialisiert wird.
3.  Pfeiltasten für Bewegung testen.
4.  Buttons für "New Game" und "Pause" testen.
5.  Prüfen, ob Score und Timer korrekt aktualisiert werden.
