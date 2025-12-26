export default function HomePage() {
  return (
    <main className="min-h-screen bg-obsidian">
      {/* Hero Section - Typography that will shatter */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 px-6">
          <h1 className="text-7xl md:text-9xl font-heading font-bold text-white">
            Quantum
          </h1>
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-gradient">
            Minimalism
          </h2>
          <p className="text-xl md:text-2xl text-neutralGray max-w-2xl mx-auto">
            An immersive 3D portfolio experience powered by AI
          </p>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-ionizedBlue rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-ionizedBlue rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-heading font-bold text-white mb-12 text-center">
            Featured Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-effect rounded-lg p-6 hover:border-ionizedBlue transition-colors">
                <div className="w-full h-48 bg-neutralGray/20 rounded-lg mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">Project {i}</h4>
                <p className="text-neutralGray text-sm">Description coming soon...</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-heading font-bold text-white mb-6">
            Let&apos;s Build Something Amazing
          </h3>
          <p className="text-xl text-neutralGray mb-8">
            Ready to bring your ideas to life with cutting-edge technology
          </p>
          <button className="px-8 py-4 bg-ionizedBlue text-white rounded-lg font-medium hover:bg-ionizedBlue/90 transition-colors">
            Get In Touch
          </button>
        </div>
      </section>
    </main>
  );
}