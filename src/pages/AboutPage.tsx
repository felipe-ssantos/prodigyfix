import React from 'react';
import { FaTools, FaBook, FaUsers, FaHeart } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 fw-bold mb-3">
            About <span className="text-primary">Bootpedia</span>
          </h1>
          <p className="lead text-muted">
            Your comprehensive guide to Hiren's Boot tools and system recovery techniques.
            We're dedicated to helping users master essential computer maintenance and recovery skills.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h2 className="mb-4">Our Mission</h2>
          <p className="mb-3">
            Bootpedia was created with a simple mission: to make computer system recovery and maintenance 
            accessible to everyone. Whether you're a seasoned IT professional or a beginner looking to 
            learn essential skills, our comprehensive tutorials will guide you through every step.
          </p>
          <p className="mb-3">
            We believe that everyone should have the knowledge and tools to recover their data, 
            repair their systems, and maintain their computers effectively. That's why we've created 
            this platform as a free, open resource for the tech community.
          </p>
          <p>
            Our tutorials cover everything from basic file recovery to advanced system repair, 
            all using the powerful tools available in Hiren's BootCD.
          </p>
        </div>
        <div className="col-lg-6">
          <div className="card bg-light">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">What We Cover</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <FaTools className="text-primary me-2" />
                  Data Recovery & File Restoration
                </li>
                <li className="mb-2">
                  <FaTools className="text-primary me-2" />
                  System Boot Repair & Recovery
                </li>
                <li className="mb-2">
                  <FaTools className="text-primary me-2" />
                  Disk Partitioning & Management
                </li>
                <li className="mb-2">
                  <FaTools className="text-primary me-2" />
                  Password Recovery & Reset
                </li>
                <li className="mb-2">
                  <FaTools className="text-primary me-2" />
                  System Backup & Restore
                </li>
                <li className="mb-2">
                  <FaTools className="text-primary me-2" />
                  Network Diagnostics & Tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What is Hiren's BootCD */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="mb-4">What is Hiren's BootCD?</h2>
              <div className="row">
                <div className="col-lg-8">
                  <p className="mb-3">
                    <strong>Hiren's BootCD</strong> is a comprehensive collection of system recovery and 
                    maintenance tools that can be booted from a CD, DVD, or USB drive. It contains hundreds 
                    of freeware utilities for data recovery, system repair, disk management, and more.
                  </p>
                  <p className="mb-3">
                    Created by Hiren, this bootable toolkit has become an essential resource for IT 
                    professionals, system administrators, and anyone who needs to troubleshoot or repair 
                    computer systems. It's particularly useful when Windows won't boot or when you need 
                    to access tools outside of the operating system.
                  </p>
                  <p>
                    Our tutorials focus on the most commonly used and effective tools from Hiren's BootCD, 
                    providing step-by-step instructions for both beginners and advanced users.
                  </p>
                </div>
                <div className="col-lg-4">
                  <div className="text-center">
                    <div className="mb-3">
                      <span className="display-1">💿</span>
                    </div>
                    <h5>Essential Toolkit</h5>
                    <p className="text-muted small">
                      A complete suite of recovery and maintenance tools
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-4">Why Choose Bootpedia?</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="mb-3">
                    <FaBook size={48} className="text-primary" />
                  </div>
                  <h5 className="card-title">Comprehensive Guides</h5>
                  <p className="card-text text-muted">
                    Step-by-step tutorials covering all aspects of system recovery and maintenance.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="mb-3">
                    <FaUsers size={48} className="text-success" />
                  </div>
                  <h5 className="card-title">Community Driven</h5>
                  <p className="card-text text-muted">
                    Built by and for the tech community, with contributions from experts worldwide.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="mb-3">
                    <FaTools size={48} className="text-warning" />
                  </div>
                  <h5 className="card-title">Practical Focus</h5>
                  <p className="card-text text-muted">
                    Real-world scenarios and practical solutions for common computer problems.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <div className="mb-3">
                    <FaHeart size={48} className="text-danger" />
                  </div>
                  <h5 className="card-title">Free & Open</h5>
                  <p className="card-text text-muted">
                    Completely free to use, with no hidden costs or premium content restrictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Our Team</h2>
              <div className="row">
                <div className="col-lg-6">
                  <h5>Bootpedia Team</h5>
                  <p className="text-muted">
                    Our team consists of IT professionals, system administrators, and tech enthusiasts 
                    who are passionate about sharing knowledge and helping others master essential 
                    computer skills.
                  </p>
                  <p className="text-muted">
                    We believe in the power of education and community, which is why we've made 
                    Bootpedia completely free and open to everyone.
                  </p>
                </div>
                <div className="col-lg-6">
                  <h5>Contributors</h5>
                  <p className="text-muted">
                    Bootpedia wouldn't be possible without the contributions of the broader tech 
                    community. We welcome contributions from anyone who wants to help improve our 
                    tutorials or add new content.
                  </p>
                  <p className="text-muted">
                    If you'd like to contribute, please don't hesitate to reach out to us through 
                    our contact page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="row">
        <div className="col-12">
          <div className="card bg-primary text-white text-center">
            <div className="card-body p-5">
              <h3 className="mb-3">Ready to Get Started?</h3>
              <p className="mb-4">
                Explore our tutorials and start learning essential system recovery skills today.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="/" className="btn btn-light btn-lg">
                  Browse Tutorials
                </a>
                <a href="/contact" className="btn btn-outline-light btn-lg">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 