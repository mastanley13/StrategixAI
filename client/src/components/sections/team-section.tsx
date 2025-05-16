export default function TeamSection() {
  const team = [
    {
      name: "Mykel Stanley",
      role: "Chief Executive Officer & Co-Founder",
      bio: "Marine veteran, ex-top recruiter, full-stack developer, process-automation strategist.",
      imageSrc: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
      imageAlt: "Mykel Stanley - CEO & Co-Founder"
    },
    {
      name: "Kieran Grogan",
      role: "Co-Founder & Chief Technology Officer",
      bio: "Marine veteran, voice-AI specialist, architecture & security lead.",
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
      imageAlt: "Kieran Grogan - CTO & Co-Founder"
    },
    {
      name: "Hunter Drout",
      role: "Co-Founder & Chief Technology Officer",
      bio: "Applied-AI engineer focused on seamless user experience and integration quality.",
      imageSrc: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
      imageAlt: "Hunter Drout - CTO & Co-Founder"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Our Team</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img 
                src={member.imageSrc}
                alt={member.imageAlt}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
                <div className="mt-4 flex space-x-3">
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Extended Network</h3>
            <p className="text-gray-600">Contract engineers, prompt writers, and designers scale per project—no bloated overhead.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
