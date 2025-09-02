export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9EDCC]">
      <div className="max-w-3xl mx-auto space-y-4 bg-white rounded-2xl shadow-xl p-8 border border-[#BDE4E1] mt-16 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#361134]">About TheraMind</h1>
        <p className="text-[#875C74]">
          TheraMind offers a compassionate, supportive space for reflection and self-care. It does not replace professional mental health care. If you are in crisis or in immediate danger, please contact local emergency services.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#F9EDCC] border rounded-lg p-4">
            <h2 className="font-semibold mb-1 text-[#4A6C6F]">Our Approach</h2>
            <p className="text-sm text-[#875C74]">
              Validation-first, gentle guidance, and clear boundaries. We support reflection, coping skills, and next steps.
            </p>
          </div>
          <div className="bg-[#BDE4E1] border rounded-lg p-4">
            <h2 className="font-semibold mb-1 text-[#98473E]">Privacy</h2>
            <p className="text-sm text-[#875C74]">
              Your data stays private. You control what’s saved. You can export or delete your data from Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
