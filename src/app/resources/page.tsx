export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9EDCC]">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 border border-[#BDE4E1] mt-16">
        <h1 className="text-3xl font-bold text-[#E4572E]">Resources</h1>
        <p className="text-[#875C74]">
          If you’re struggling or in crisis, please reach out to a trusted person or a professional resource below.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#F9EDCC] border rounded-lg p-4">
            <h2 className="font-semibold mb-2 text-[#4A6C6F]">Immediate Support</h2>
            <ul className="text-sm space-y-2 text-[#4B1111]">
              <li>US: 988 Suicide & Crisis Lifeline — <span className="font-medium">988</span></li>
              <li>UK & ROI: Samaritans — <span className="font-medium">116 123</span></li>
              <li>Australia: Lifeline — <span className="font-medium">13 11 14</span></li>
              <li>Canada: Talk Suicide — <span className="font-medium">1-833-456-4566</span></li>
            </ul>
          </div>
          <div className="bg-[#BDE4E1] border rounded-lg p-4">
            <h2 className="font-semibold mb-2 text-[#98473E]">Coping Skills</h2>
            <ul className="text-sm space-y-2 text-[#875C74]">
              <li>Box breathing (4-4-4-4) for 2–3 minutes.</li>
              <li>Grounding with 5-4-3-2-1 senses check.</li>
              <li>Short walk or stretch; sip water.</li>
              <li>Write one kind sentence to yourself.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
