// Small "model still fine-tuning" badge shown next to predictions for matches
// (currently the Semi-finals) whose model output isn't finalized yet.
export default function ProvisionalBadge({ style }) {
  return (
    <span
      title="Model is being fine-tuned for this round — prediction to be confirmed"
      style={{
        fontFamily: "var(--font-mono,'DM Mono',monospace)",
        fontSize: 7,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'rgba(240,165,0,.9)',
        background: 'rgba(240,165,0,.08)',
        border: '1px solid rgba(240,165,0,.22)',
        padding: '2px 6px',
        borderRadius: 2,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      To be confirmed
    </span>
  );
}
