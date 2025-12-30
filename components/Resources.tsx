
import React from 'react';

const Resources: React.FC = () => {
  const resources = [
    {
      title: "FAO Plant Health",
      desc: "United Nations portal for global plant protection and disease control standards.",
      link: "https://www.fao.org/plant-health-challenge/en/",
      icon: "🌐"
    },
    {
      title: "PlantVillage",
      desc: "Open source database of crop diseases with high-quality reference images.",
      link: "https://plantvillage.psu.edu/",
      icon: "🏠"
    },
    {
      title: "CABI Plantwise",
      desc: "Knowledge bank for managing plant health problems across the globe.",
      link: "https://www.plantwise.org/KnowledgeBank",
      icon: "📚"
    },
    {
      title: "Cornell Plant Pathology",
      desc: "Academic resources for in-depth study of fungal, bacterial, and viral plant pathogens.",
      link: "https://plantpath.cornell.edu/",
      icon: "🎓"
    },
    {
      title: "USDA APHIS",
      desc: "Protecting American agriculture from pests and diseases.",
      link: "https://www.aphis.usda.gov/",
      icon: "🛡️"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural Resources</h1>
      <p className="text-gray-500 mb-10">Trusted sources for crop disease info and management.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res, i) => (
          <a 
            key={i} 
            href={res.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{res.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{res.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{res.desc}</p>
            <div className="flex items-center text-emerald-600 font-bold text-sm">
              Visit Site
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-900 mb-4">Farmer Support Networks</h3>
        <p className="text-emerald-800 text-sm mb-6">
          Connect with local extension offices or farmer groups to share experiences and get real-time local advice. 
          AgroVision AI is a supporting tool, but on-field experts remain vital for complex cases.
        </p>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200">Find Local Extension Office</button>
      </div>
    </div>
  );
};

export default Resources;
