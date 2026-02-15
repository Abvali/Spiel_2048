# Implementierungsplan: Spezifische Code-Ausschnitte

Dieser Plan befasst sich mit den spezifischen Code-Problemen, die in Abschnitt "4. Spezifische Code-Ausschnitte" des Reviews identifiziert wurden.

## 1. Implementierung von `slideLeft`

**Problem**: Die Funktion `slideLeft` hat einen hartcodierten Wert von `4` für die Rastergröße.
```javascript
while (merged.length < 4) { // Hartcodiert
  merged.push(0);
}
```

**Vorgeschlagene Änderung**:
- Ersetzen von `4` durch `this.columns` (oder `GRID_SIZE` Konstante).
- Sicherstellen, dass die Funktion sich dynamisch an die in der Klasse definierte Rastergröße anpasst.

```javascript
while (merged.length < this.columns) {
  merged.push(0);
}
```

## 2. Optimierung der `renderBoard`-Animation

**Problem**: Die aktuelle Animationslogik durchsucht `prevBoard` mit verschachtelten Schleifen (O(N^2) innerhalb des Renderings), um herauszufinden, woher eine Kachel kam. Dies ist ineffizient und fehleranfällig, wenn mehrere Kacheln denselben Wert haben.

**Vorgeschlagene Änderung**:
-   **Bewegung verfolgen**: Anstatt die Bewegung *im Nachhinein* abzuleiten, sollte die `move`-Logik eine `transitions`-Map oder ein Array generieren.
-   **Datenstruktur**:
    ```javascript
    // Beispielstruktur generiert während move()
    const transitions = [
      { id: 'tile-123', from: {r:0, c:0}, to: {r:0, c:1}, value: 2 },
      { id: 'tile-456', from: {r:0, c:3}, to: {r:0, c:2}, value: 4, type: 'merge' }
    ];
    ```
-   **Kachel-IDs**:
    -   Zuweisen einer eindeutigen ID zu jeder Kachel, wenn sie erstellt wird.
    -   Beibehalten dieser ID beim Bewegen.
    -   Beim Zusammenführen (Merge) die ID der "überlebenden" Kachel behalten oder eine neue gemergte ID erstellen.
-   **Render-Logik**:
    -   Durchlaufen der `transitions`-Liste, um CSS-Transforms anzuwenden.
    -   Dies ändert die Komplexität auf O(N) (Anzahl der Kacheln) und stellt pixelgenaue Animationen sicher.

## Ausführung

- Diese Änderungen sollten direkt in die Methoden `slideLeft` (oder `move`) und `render` der neuen `Game2048`-Klasse integriert werden.
