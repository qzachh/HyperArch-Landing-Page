import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from './lib/supabase';

const ROTATING_TITLES = [
  "You Design. Let Us Handle This Mess.",
  "Never Again Lose a Great Idea to All These Compliances."
];

const PAIN_POINTS = [
  "Constant Drawing Revision",
  "No Centralised Documentation Hub", 
  "Version Control",
  "Translation Between Software",
  "Mismatched Drawings & Site Work",
  "Coordination Issues",
  "Others"
];

const PAPER_CONTENTS = [
  "☑ Fire Safety Code\n□ Accessibility Standards\n□ Zoning Requirements\n☑ Building Height Limits\n□ Emergency Exits\n☑ Parking Requirements",
  "□ Structural Load Limits\n☑ Ventilation Standards\n□ Emergency Exits\n□ Parking Requirements\n☑ Energy Efficiency\n□ Noise Regulations",
  "☑ Energy Efficiency\n□ Noise Regulations\n☑ Setback Requirements\n□ Material Standards\n☑ Wind Load Standards\n□ Foundation Specs",
  "□ Electrical Code\n☑ Plumbing Standards\n□ Environmental Impact\n□ Historic Preservation\n☑ Seismic Requirements\n□ HVAC Requirements",
  "☑ Seismic Requirements\n□ Wind Load Standards\n□ Foundation Specs\n☑ Insulation Code\n□ Water Management\n☑ Lighting Standards",
  "□ Lighting Standards\n☑ HVAC Requirements\n□ Water Management\n□ Waste Disposal\n☑ Building Materials\n□ Site Drainage"
];

function App() {
  const [currentTitle, setCurrentTitle] = useState(0);
  const [activeTab, setActiveTab] = useState('compliance');
  const [slideshowImages, setSlideshowImages] = useState({ compliance: [], documentation: [] });
  const [currentSlides, setCurrentSlides] = useState({ compliance: 0, documentation: 0 });
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    preferredSolution: 'Compliance Checker',
    note: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch slideshow images from database
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data: complianceImages } = await supabase
          .from('slideshow_images')
          .select('image_url, alt_text')
          .eq('category', 'compliance')
          .order('order_index');

        const { data: documentationImages } = await supabase
          .from('slideshow_images')
          .select('image_url, alt_text')
          .eq('category', 'documentation')
          .order('order_index');

        setSlideshowImages({
          compliance: complianceImages || [],
          documentation: documentationImages || []
        });
      } catch (error) {
        console.error('Error fetching images:', error);
        // Fallback to placeholder images
        setSlideshowImages({
          compliance: [
            { image_url: '', alt_text: 'Compliance Check Interface' },
            { image_url: '', alt_text: 'AI Rule Analysis Dashboard' },
            { image_url: '', alt_text: 'Code Validation Results' },
            { image_url: '', alt_text: 'Smart Suggestion Panel' }
          ],
          documentation: [
            { image_url: '', alt_text: 'Format Transformation View' },
            { image_url: '', alt_text: 'Automated Drawing Generator' },
            { image_url: '', alt_text: 'Multi-Output Preview' },
            { image_url: '', alt_text: 'Custom Template Builder' }
          ]
        });
      }
    };

    fetchImages();
  }, []);

  // Rotating title effect
  useEffect(() => {
    const interval = setInterval(() => {
      const titleElement = document.querySelector('.hero-title');
      if (titleElement) {
        titleElement.style.opacity = '0';
        setTimeout(() => {
          setCurrentTitle(prev => (prev + 1) % ROTATING_TITLES.length);
          titleElement.style.opacity = '1';
        }, 500);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlides(prev => ({
        compliance: (prev.compliance + 1) % (slideshowImages.compliance.length || 1),
        documentation: (prev.documentation + 1) % (slideshowImages.documentation.length || 1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshowImages]);

  // Parallax effect for papers
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const papers = document.querySelectorAll('.paper');
      
      papers.forEach((paper, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = scrollY * speed;
        const rotation = [-12, 8, 15, -6][index];
        (paper as HTMLElement).style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePainPointToggle = (painPoint: string) => {
    setSelectedPainPoints(prev => 
      prev.includes(painPoint)
        ? prev.filter(p => p !== painPoint)
        : [...prev, painPoint]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit to Supabase
      const submissionData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone || null,
        preferred_solution: formData.preferredSolution,
        pain_points: selectedPainPoints,
        note: formData.note || null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (error) {
        throw error;
      }

      // Send email notification
      await supabase.functions.invoke('send-contact-email', {
        body: submissionData
      });
      
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          preferredSolution: 'Compliance Checker',
          note: ''
        });
        setSelectedPainPoints([]);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className="header">
        <div className="header-content">
          <a href="#" className="logo">HYPERARCH</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          {PAPER_CONTENTS.map((content, index) => (
            <div 
              key={index}
              className={`paper paper-${index + 1}`}
              data-content={content}
              data-rotation={[-12, 8, 15, -6, 10, -8][index]}
            ></div>
          ))}
        </div>
        
        <div className="hero-content">
          <h1 
            className="hero-title"
            style={{ transition: 'opacity 0.5s ease-in-out' }}
          >
            {ROTATING_TITLES[currentTitle]}
          </h1>
          <a href="#mockups" className="explore-btn">
            Explore Solutions
            <ChevronRight size={20} />
          </a>
        </div>
      </section>

      {/* Mockup Showcase Section */}
      <section id="mockups" className="mockup-section">
        <div className="mockup-container">
          <div className="tab-container">
            <button 
              className={`tab ${activeTab === 'compliance' ? 'active' : ''}`}
              onClick={() => setActiveTab('compliance')}
            >
              Compliance Checker
              <span className="coming-soon">Coming Soon</span>
            </button>
            <button 
              className={`tab ${activeTab === 'documentation' ? 'active' : ''}`}
              onClick={() => setActiveTab('documentation')}
            >
              Documentation Shapeshifter
            </button>
          </div>

          <div className="tab-content">
            {/* Compliance Checker Tab */}
            <div className={`tab-panel ${activeTab === 'compliance' ? 'active' : ''}`}>
              <div className="panel-grid">
                <div className="panel-content">
                  <h3>AI-Powered Compliance Checker</h3>
                  <p className="panel-caption">
                    Input project rules & codes → flag non-compliant parts in drawings and suggest fixes.
                  </p>
                  <p className="panel-description">
                    Transform your workflow with our AI-powered compliance checker. Input any local building codes, 
                    project requirements, and client preferences into a centralised hub. Our AI continuously monitors 
                    your submitted drawings, instantly flagging non-compliant elements and suggesting intelligent fixes. 
                    Never miss a regulation again.
                  </p>
                </div>
                <div className="slideshow">
                  {slideshowImages.compliance.map((image, index) => (
                    <div 
                      key={index}
                      className={`slide ${index === currentSlides.compliance ? 'active' : ''}`}
                    >
                      {image.image_url ? (
                        <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover" />
                      ) : (
                        image.alt_text
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documentation Shapeshifter Tab */}
            <div className={`tab-panel ${activeTab === 'documentation' ? 'active' : ''}`}>
              <div className="panel-grid">
                <div className="panel-content">
                  <h3>Documentation Shapeshifter</h3>
                  <p className="panel-caption">
                    Transform base architectural plans into various submission-specific formats 
                    (e.g., tender, structural, client presentation).
                  </p>
                  <p className="panel-description">
                    Revolutionise your documentation process with intelligent format automation & element generation. 
                    Upload your base drawings and watch as our AI generates the labels/lines/dimensions you need. 
                    It will ensure submission-specific formats with proper sizing, line weights, and zero overlapping. 
                    Smart filtering ensures the right information appears for each submission type - from dimensioning 
                    and titles to compliance indicators and boundary lines. Full customisation available.
                  </p>
                </div>
                <div className="slideshow">
                  {slideshowImages.documentation.map((image, index) => (
                    <div 
                      key={index}
                      className={`slide ${index === currentSlides.documentation ? 'active' : ''}`}
                    >
                      {image.image_url ? (
                        <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover" />
                      ) : (
                        image.alt_text
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-container">
          <div className="contact-title">
            <p className="contact-subtitle">Are You Facing Other Pain Points?</p>
            <h2 className="contact-main-title">Talk to Us!</h2>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              {/* Pain Points Selection */}
              <div className="pain-points">
                <div className="pain-points-grid">
                  {PAIN_POINTS.map((painPoint) => (
                    <button
                      key={painPoint}
                      type="button"
                      className={`pain-point-btn ${selectedPainPoints.includes(painPoint) ? 'selected' : ''}`}
                      onClick={() => handlePainPointToggle(painPoint)}
                    >
                      <div className="pain-point-checkbox"></div>
                      {painPoint}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="company">Company/Organisation *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="form-control"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label" htmlFor="preferredSolution">Select Preferred Solution *</label>
                  <select
                    id="preferredSolution"
                    name="preferredSolution"
                    className="form-control"
                    value={formData.preferredSolution}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Compliance Checker">Compliance Checker</option>
                    <option value="Documentation Shapeshifter">Documentation Shapeshifter</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label" htmlFor="note">Note (Optional)</label>
                  <textarea
                    id="note"
                    name="note"
                    className="form-control"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us more about your specific needs..."
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Let's Chat
              </button>
            </form>
          ) : (
            <div className="success-message fade-in">
              <h3>Thank you for your interest!</h3>
              <p>We've received your information and will be in touch shortly to discuss how HyperArch can help streamline your architectural workflow.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">HYPERARCH</div>
          <p>&copy; 2025 HyperArch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;