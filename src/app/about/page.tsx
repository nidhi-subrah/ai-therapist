export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-foreground">About AI Therapist</h1>
        <p className="text-muted-foreground">
          AI Therapist offers a compassionate, supportive space for reflection and self-care. It does not replace
          professional mental health care. If you are in crisis or in immediate danger, please contact local emergency
          services.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-1">Our Approach</h2>
            <p className="text-sm text-muted-foreground">
              Validation-first, gentle guidance, and clear boundaries. We support reflection, coping skills, and next steps.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h2 className="font-semibold mb-1">Privacy</h2>
            <p className="text-sm text-muted-foreground">
              Your data stays private. You control what’s saved. You can export or delete your data from Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
