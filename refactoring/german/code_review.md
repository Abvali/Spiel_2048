# Code-Review: `js/app.js`

Dieses Dokument liefert die Ergebnisse des Code-Reviews von `js/app.js` und bietet Verbesserungsvorschläge.

## 1. Architektur & Struktur

### Verschmutzung des globalen Namensraums
**Problem**: Der Spielstatus (`board`, `score`, `timerInterval`, usw.) und Hilfsfunktionen sind im globalen Scope deklariert.
**Auswirkung**: Dies erschwert die Wartung, das Testen und die Erweiterung des Codes. Es erhöht auch das Risiko von Namenskollisionen, wenn weitere Skripte hinzugefügt werden.
**Vorschlag**: Kapseln Sie die Spiellogik in eine `class Game2048` oder ein Modul. Dies ermöglicht eine bessere Verwaltung des Zustands und potenziell mehrere Spielinstanzen auf einer Seite.

### Trennung der Zuständigkeiten (Separation of Concerns)
**Problem**: Spiellogik (Array-Manipulation) und UI-Logik (DOM-Aktualisierungen) sind eng miteinander verbunden. Zum Beispiel aktualisiert `startTimer` das DOM direkt innerhalb des Intervalls.
**Vorschlag**: Trennen Sie die "Engine" (Spielregeln) vom "Renderer" (UI). Die Engine sollte Events auslösen oder Callbacks aufrufen, wenn sich der Status ändert, und der Renderer sollte die UI aktualisieren.

## 2. Spiellogik & Regeln

### Wahrscheinlichkeit für zufällige Kacheln
**Problem**: Die Funktion `twoOrFour` hat eine 50/50-Chance, eine 2 oder eine 4 zu generieren.
```javascript
const twoNum = Math.floor(Math.random() * 2 + 1); // Gibt 1 oder 2 zurück
return twoNum == 2 ? 2 : 4;
```
**Standard 2048-Regel**: Das Standardspiel hat normalerweise eine Chance von etwa 90% für eine 2 und 10% für eine 4.
**Vorschlag**: Passen Sie die Wahrscheinlichkeitslogik an das Standard-Gameplay an oder machen Sie sie konfigurierbar.

### Hartcodierte Rastergröße
**Problem**: Obwohl `rows` und `columns` als Konstanten definiert sind, ist der Wert `4` in `slideLeft` hartcodiert (Zeile 90: `while (merged.length < 4)`).
**Vorschlag**: Verwenden Sie die Variable `columns` anstelle der hartcodierten `4`, um sicherzustellen, dass das Spiel korrekt funktioniert, wenn sich die Rastergröße ändert.

## 3. Code-Qualität & Leistung

### Benennung von Variablen
-   Funktionen wie `el`, `group`, `create` sind generisch. Erwägen Sie Standardnamen wie `$` oder rein beschreibende Namen wie `qs` (querySelector).
-   `twoOrFour` ist beschreibend, aber implementierungsgebunden. `getRandomTileValue` wäre besser.
-   `addNum` könnte `spawnRandomTile` heißen.

### Array-Manipulation
**Problem**: `moveRight`, `moveUp` und `moveDown` basieren auf `transpose` und `reverse`.
**Auswirkung**: Dies beinhaltet das Erstellen mehrerer temporärer Arrays und das mehrmalige Durchlaufen des Boards für einen einzigen Zug.
**Vorschlag**: Für ein 4x4-Raster ist dies akzeptabel, aber ineffizient. Ein robusterer Ansatz beinhaltet Koordinaten-Mapping-Logik oder die Übergabe eines generischen `Vektors` an die Traversierungsfunktion, was die Speicherzuweisung reduziert.

### Timer-Logik
**Problem**: `startTimer` verwendet `Date.now()`, was gut ist, aber die UI-Aktualisierung erfolgt jede Sekunde innerhalb eines `setInterval`.
**Vorschlag**: Für flüssigere Aktualisierungen oder Pausengenauigkeit könnte `requestAnimationFrame` verwendet werden, aber `setInterval` ist hier akzeptabel. Stellen Sie sicher, dass `clearInterval` robust aufgerufen wird (scheint aktuell behandelt zu werden).
**Minor**: `startTime = Date.now() - elapsedTime` verlässt sich darauf, dass `elapsedTime` beim Pausieren korrekt verfolgt wird.

## 4. Spezifische Code-Ausschnitte

### Implementierung von `slideLeft`
```javascript
while (merged.length < 4) { // Hartcodierte 4
  merged.push(0);
}
```
**Korrektur**: `while (merged.length < columns) { ... }`

### `renderBoard` Animation
**Problem**: Die Animationslogik versucht, Bewegungen abzuleiten, indem sie das `prevBoard` scannt. Dies hat eine Komplexität von O(N^2) innerhalb der Render-Schleife (verschachtelte Schleifen zum Finden der Kachel).
**Vorschlag**: Verfolgen Sie bestimmte Kachel-IDs oder Bewegungsvektoren während der Logikphase (`slideLeft`), anstatt sie im Nachhinein abzuleiten. Dies stellt sicher, dass Animationen immer korrekt sind und 1:1 mit der Logik übereinstimmen.

## Zusammenfassung der empfohlenen Maßnahmen

1.  **Refactoring zur Klasse**: Erstellen Sie eine `Game`-Klasse, um den Status (`board`, `score`, `gameState`) zu halten.
2.  **Wahrscheinlichkeit korrigieren**: Ändern Sie `twoOrFour`, um die '2' zu bevorzugen.
3.  **Magische Zahlen entfernen**: Stellen Sie sicher, dass `rows` und `columns` überall verwendet werden.
4.  **Animation optimieren**: Weisen Sie Kacheln eindeutige IDs zu, um ihre Bewegung zuverlässig zu verfolgen, anstatt Werte abzugleichen.
