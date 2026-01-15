interface CVData {
  profile: any;
  experience: any[];
  education: any[];
  skills: string[];
}

export const CVContent = ({ data }: { data: CVData }) => {
  const highlightKeywords = (text: string) => {
    const keywords = [
      'React',
      'Next.js',
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
      'LLMs',
      'UX'
    ];
    let result = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      result = result.replace(regex, `<strong>${keyword}</strong>`);
    });
    return result;
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] text-black dark:text-slate-200 w-full h-full p-[40px] md:p-[50px] flex flex-col font-sans">
      <header className="border-b-2 border-black dark:border-white pb-4 mb-6">
        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white uppercase leading-none mb-1">{data.profile.name}</h1>
        <h2 className="text-lg font-normal text-black dark:text-slate-300 tracking-wide">{data.profile.role}</h2>
      </header>

      <div className="mb-6 text-[13px] leading-relaxed text-black dark:text-slate-300">
        {data.profile.summary.split('\n\n').map((paragraph: string, idx: number) => (
          <p key={idx} className={idx > 0 ? 'mt-3' : ''} dangerouslySetInnerHTML={{ __html: highlightKeywords(paragraph) }} />
        ))}
      </div>

      <section className="mb-6">
        <h3 className="text-xl font-bold uppercase border-b border-black dark:border-slate-600 pb-1 mb-4 text-black dark:text-white">EXPERIENCIA</h3>

        <div className="flex flex-col gap-5">
          {data.experience.map(job => (
            <div key={job.id}>
              <div className="flex items-baseline gap-2 mb-0.5">
                <h4 className="text-base font-bold text-black dark:text-white">
                  {job.company} | {job.role}
                </h4>
              </div>
              <div className="text-[12px] text-gray-600 dark:text-slate-400 mb-2">{job.period}</div>

              {job.bullets && (
                <ul className="list-disc list-outside ml-4 text-[13px] text-black dark:text-slate-300 space-y-1">
                  {job.bullets.map((bullet: string, idx: number) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: highlightKeywords(bullet) }} />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-bold uppercase border-b border-black dark:border-slate-600 pb-1 mb-4 text-black dark:text-white">EDUCACIÓN</h3>
        {data.education.map(edu => (
          <div key={edu.id}>
            <h4 className="text-base font-bold text-black dark:text-white">{edu.degree}</h4>
            <div className="text-[13px] text-black dark:text-slate-300">
              {edu.institution} {edu.period}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-bold uppercase border-b border-black dark:border-slate-600 pb-1 mb-4 text-black dark:text-white">CONTACTO</h3>
        <div className="text-[13px] text-black dark:text-slate-300 space-y-1">
          <div>
            <span className="font-medium">Email:</span>{' '}
            <a href={`mailto:${data.profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.profile.email}
            </a>
          </div>
          <div>
            <span className="font-medium">LinkedIn:</span>{' '}
            <a href={`https://${data.profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.profile.linkedin}
            </a>
          </div>
          <div>
            <span className="font-medium">GitHub:</span>{' '}
            <a href={`https://${data.profile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.profile.github}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
