interface CVData {
  profile: any;
  experience: any[];
  education: any[];
  skills: string[];
}

export const CVContent = ({ data }: { data: CVData }) => {
  const getSectionTitle = (key: string) => {
    // Detect language based on experience period text (Spanish uses "Actualidad", English uses "Present")
    const isEnglish = data.experience[0]?.period?.includes('Present') && !data.experience[0]?.period?.includes('Actualidad');

    const titles = {
      experience: isEnglish ? 'EXPERIENCE' : 'EXPERIENCIA',
      education: isEnglish ? 'EDUCATION' : 'EDUCACIÓN',
      contact: isEnglish ? 'CONTACT' : 'CONTACTO'
    };

    return titles[key as keyof typeof titles] || key;
  };

  const highlightKeywords = (text: string) => {
    const keywords = [
      'React',
      'ReactJS',
      'Next.js',
      'NextJS',
      'TypeScript',
      'Redux',
      'HTML5',
      'CSS3',
      'Astro',
      'React Native',
      'Expo',
      'Expo Go',
      'Node.js',
      'Express.js',
      'Python',
      'FastAPI',
      'NestJS',
      'Docker',
      'AWS',
      'MongoDB',
      'PostgreSQL',
      'Git',
      'LangGraph',
      'LLM',
      'LLMs',
      'UX',
      'Agile',
      'Java Servlets',
      'JSP',
      'Bootstrap',
      'Artificial Intelligence',
      'Inteligencia Artificial'
    ];
    let result = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      result = result.replace(regex, `<strong>${keyword}</strong>`);
    });
    return result;
  };

  return (
    <div className="bg-white dark:bg-[#212121] text-black dark:text-slate-200 w-full h-full md:min-h-[297mm] p-5 sm:p-8 md:p-[40px] lg:p-[50px] flex flex-col font-sans">
      {/* Header with separator after role */}
      <header className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white uppercase leading-none mb-1">{data.profile.name}</h1>
        <h2 className="text-sm sm:text-base md:text-lg font-normal text-gray-600 dark:text-slate-400 tracking-wide mb-3 sm:mb-4">{data.profile.role}</h2>
        <div className="border-b-2 border-black dark:border-white"></div>
      </header>

      {/* Experience section with separator at the end */}
      <section className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-3 sm:mb-4 text-black dark:text-white">{getSectionTitle('experience')}</h3>

        <div className="flex flex-col gap-3 sm:gap-4">
          {data.experience.map(job => (
            <div key={job.id}>
              <h4 className="text-sm sm:text-base font-bold text-black dark:text-white">
                {job.company} | {job.role}
              </h4>
              <div className="text-[11px] sm:text-[12px] text-gray-600 dark:text-slate-400 mb-1.5 sm:mb-2">{job.period}</div>

              {job.bullets && (
                <ul className="list-disc list-outside ml-3 sm:ml-4 text-[12px] sm:text-[13px] text-black dark:text-slate-300 space-y-0.5 sm:space-y-1">
                  {job.bullets.map((bullet: string, idx: number) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: highlightKeywords(bullet) }} />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="border-b border-black dark:border-slate-600 mt-4 sm:mt-6"></div>
      </section>

      {/* Education section with separator at the end */}
      <section className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-3 sm:mb-4 text-black dark:text-white">{getSectionTitle('education')}</h3>
        {data.education.map(edu => (
          <div key={edu.id}>
            <h4 className="text-sm sm:text-base font-bold text-black dark:text-white">{edu.degree}</h4>
            <div className="text-[12px] sm:text-[13px] text-black dark:text-slate-300">
              {edu.institution} {edu.period}
            </div>
          </div>
        ))}
        <div className="border-b border-black dark:border-slate-600 mt-4 sm:mt-6"></div>
      </section>

      {/* Contact section with bullet points */}
      <section className="mt-auto">
        <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-3 sm:mb-4 text-black dark:text-white">{getSectionTitle('contact')}</h3>
        <ul className="text-[12px] sm:text-[13px] text-black dark:text-slate-300 space-y-0.5 sm:space-y-1 list-disc list-outside ml-3 sm:ml-4">
          <li>
            <span className="font-medium">Email:</span>{' '}
            <a href={`mailto:${data.profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.profile.email}
            </a>
          </li>
          <li>
            <span className="font-medium">LinkedIn:</span>{' '}
            <a href={`https://${data.profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.profile.linkedin}
            </a>
          </li>
          <li>
            <span className="font-medium">GitHub:</span>{' '}
            <a href={`https://${data.profile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.profile.github}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};
