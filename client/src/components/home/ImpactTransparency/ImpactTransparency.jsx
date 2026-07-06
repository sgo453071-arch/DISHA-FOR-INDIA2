import React from 'react';
import { ArrowRight, FileText, FolderOpen, FileCheck, FileSpreadsheet, Download } from 'lucide-react';
import './ImpactTransparency.css';

const reports = [
  {
    id: 1,
    title: 'Annual Impact Report 2025',
    date: 'January 2025',
    icon: FileText,
    pdf: '#',
  },
  {
    id: 2,
    title: 'NGO Partner Directory',
    date: 'December 2024',
    icon: FolderOpen,
    pdf: '#',
  },
  {
    id: 3,
    title: 'Volunteer Handbook',
    date: 'March 2025',
    icon: FileCheck,
    pdf: '#',
  },
  {
    id: 4,
    title: 'Financial Transparency Statement',
    date: 'April 2025',
    icon: FileSpreadsheet,
    pdf: '#',
  },
];

const ImpactTransparency = () => {
  return (
    <section className="it-section" aria-labelledby="it-heading">
      
      {/* Decorative background elements */}
      <div className="it-deco-blob" aria-hidden="true" />
      
      {/* Optional dotted pattern or line art could go here */}
      <div className="it-deco-dots" aria-hidden="true">
         {/* Simple SVG pattern for dots */}
         <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
           <defs>
             <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="2" fill="currentColor" />
             </pattern>
           </defs>
           <rect width="200" height="200" fill="url(#dotPattern)" />
         </svg>
      </div>

      <div className="it-container">
        
        {/* Section Header */}
        <div className="it-header">
          <div className="it-header-left">
            <span className="it-accent">Reports & Resources</span>
            <h2 id="it-heading" className="it-title">
              Our Impact & Transparency
            </h2>
            <div className="it-divider" />
            <p className="it-desc">
              Explore our reports, policies, and transparency documents
              to learn how Disha creates measurable impact across communities.
            </p>
          </div>
          
          <a href="#" className="it-more-link" aria-label="View more reports and resources">
            More Reports
            <ArrowRight size={18} className="it-more-arrow" />
          </a>
        </div>

        {/* Reports Grid */}
        <div className="it-grid">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <a 
                key={report.id} 
                href={report.pdf}
                className="it-card"
                aria-label={`Download ${report.title} PDF`}
              >
                {/* Card Top: Icon & Info */}
                <div className="it-card-top">
                  <div className="it-icon-wrap">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <div className="it-card-info">
                    <h3 className="it-card-title">{report.title}</h3>
                    <p className="it-card-date">Published &bull; {report.date}</p>
                  </div>
                </div>

                {/* Separator Line */}
                <div className="it-separator" />

                {/* Card Bottom: Download Link */}
                <div className="it-card-bottom">
                  <span className="it-download-text">
                    <Download size={18} />
                    Download PDF
                  </span>
                  <ArrowRight size={20} className="it-download-arrow" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactTransparency;
