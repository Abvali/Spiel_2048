# Implementierungsplan: Code-Qualität & Leistung

Dieser Plan konzentriert sich auf die Verbesserung der Lesbarkeit, Wartbarkeit und Leistung des 2048-Spielcodes und befasst sich mit den Problemen, die im Abschnitt "Code-Qualität & Leistung" des Reviews identifiziert wurden.

## 1. Namenskonventionen & Lesbarkeit

**Ziel**: Ersetzen von generischen oder mehrdeutigen Namen durch beschreibende Standardnamen.

-   **Hilfsfunktionen**:
    -   Umbenennen `el(css)` -> `qs(selector)` (Query Selector) oder ganz entfernen, wenn die Nutzung gering ist.
    -   Umbenennen `group(css)` -> `qsa(selector)` (Query Selector All).
    -   Umbenennen `create(html)` -> `createNode(tag)`.
-   **Spiellogik**:
    -   Umbenennen `twoOrFour()` -> `generateRandomTileValue()`.
    -   Umbenennen `addNum()` -> `spawnRandomTile()`.
    -   Umbenennen `rows`/`columns` -> `GRID_SIZE` (wenn quadratisch) oder beibehalten, aber konsistente Nutzung sicherstellen.

## 2. Optimierung: Array-Manipulation

**Ziel**: Reduzierung unnötiger Array-Erstellung und -Iteration während der Züge.

-   **Aktueller Ansatz**:
    -   `moveRight` = `board` -> `reverse` -> `slideLeft` -> `reverse`.
    -   `moveUp` = `board` -> `transpose` -> `slideLeft` -> `transpose`.
    -   Dies erstellt mehrere temporäre Arrays und iteriert das Raster mehrmals pro Zug.

-   **Vorgeschlagener optimierter Ansatz**:
    -   Implementieren einer einzigen `traverseAndMerge(vector)`-Methode.
    -   Iterieren durch das Raster mittels Koordinatenmathematik basierend auf dem Vektor `(dx, dy)`.
    -   Verschieben der Kacheln direkt an ihr Ziel, ohne vollständige temporäre Board-Kopien für Rotation/Umkehrung zu erstellen.
    -   **Vorteil**: Reduziert Speicherzuweisung und CPU-Zyklen, wichtig für mobile Leistung oder größere Raster.

## 3. Verbesserungen der Timer-Logik

**Ziel**: Entkopplung der Spiellogik von UI-Aktualisierungen und Verbesserung der Präzision.

-   **Logik**:
    -   Speichern von `startTime` und `accumulatedTime`.
    -   Verwendung von `requestAnimationFrame` zur Aktualisierung der UI-Anzeige (Timer-Ziffern), um sicherzustellen, dass der Hauptthread nicht blockiert oder verzögert wird, obwohl `setInterval` akzeptabel ist, wenn `document.visibilityState` geprüft wird.
-   **Kapselung**:
    -   Erstellen einer `Timer`-Klasse oder eines Objekts, das `start`, `stop`, `reset` und `getFormattedTime` behandelt.
    -   Der Gameloop fragt einfach den Timer ab.

## 4. Allgemeine Code-Bereinigung

-   **Magische Zahlen**: Definieren von Konstanten für Animationsdauern (z.B. `ANIMATION_DURATION = 400`).
-   **Event-Delegation**: Sicherstellen, dass Event-Listener effizient angehängt werden.
-   **Strikte Gleichheit**: Überprüfen der Verwendung von `===` überall.

## Ausführungsstrategie

Diese Änderungen können zusammen mit dem **Klassen-Refactoring** oder als separater Durchgang angewendet werden.
-   **Empfohlen**: Während des Klassen-Refactorings anwenden, um das Umschreiben derselben Logik zu vermeiden. Die neue `Game2048`-Klasse sollte von Anfang an die neue Benennung und optimierte Logik verwenden.
