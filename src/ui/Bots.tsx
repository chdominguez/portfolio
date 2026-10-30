/** Decorative ASCII bots for the #code terminal. Positioned and animated by engine/terminalDom.ts. */
export function Bots() {
  return (
    <div className="bots" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="bot" />
      ))}
    </div>
  );
}
