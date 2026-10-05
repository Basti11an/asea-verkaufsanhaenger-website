export function WatermarkOverlay() {
  return (
    <div className="asea-watermark" aria-hidden="true">
      {Array.from({ length: 48 }, (_, i) => (
        <span key={i}>ASEA</span>
      ))}
    </div>
  );
}
