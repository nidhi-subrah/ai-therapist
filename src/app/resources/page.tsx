export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-foreground">Resources</h1>
      <p className="text-muted-foreground">
        If you’re struggling or in crisis, please reach out to a trusted person or a professional resource below.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Immediate Support</h2>
          <ul className="text-sm space-y-2">
            <li>US: 988 Suicide & Crisis Lifeline — <span className="font-medium">988</span></li>
            <li>UK & ROI: Samaritans — <span className="font-medium">116 123</span></li>
            <li>Australia: Lifeline — <span className="font-medium">13 11 14</span></li>
            <li>Canada: Talk Suicide — <span className="font-medium">1-833-456-4566</span></li>
          </ul>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Coping Skills</h2>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>Box breathing (4-4-4-4) for 2–3 minutes.</li>
            <li>Grounding with 5-4-3-2-1 senses check.</li>
            <li>Short walk or stretch; sip water.</li>
            <li>Write one kind sentence to yourself.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
