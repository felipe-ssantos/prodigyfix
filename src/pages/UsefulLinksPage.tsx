// src/pages/UsefulLinksPage.tsx
import {
  FaExternalLinkAlt,
  FaBook,
  FaTools,
  FaShieldAlt,
  FaUsers
} from 'react-icons/fa'

interface LinkItem {
  name: string
  description: string
  url: string
  icon: string
  category: string
}

const UsefulLinksPage = () => {
  const links = {
    tools: [
      {
        name: "Hiren's BootCD",
        description: "The official Hiren's BootCD download and information",
        url: 'https://www.hirensbootcd.org/',
        icon: '💿',
        category: 'Primary Tool'
      },
      {
        name: 'Recuva',
        description: 'Professional file recovery software',
        url: 'https://www.ccleaner.com/recuva',
        icon: '🔄',
        category: 'Data Recovery'
      },
      {
        name: 'GParted',
        description:
          'Free partition editor for graphically managing disk partitions',
        url: 'https://gparted.org/',
        icon: '💾',
        category: 'Disk Management'
      },
      {
        name: 'TestDisk',
        description: 'Powerful data recovery software',
        url: 'https://www.cgsecurity.org/wiki/TestDisk',
        icon: '🔍',
        category: 'Data Recovery'
      }
    ],
    resources: [
      {
        name: 'Microsoft Support',
        description: 'Official Windows support and troubleshooting guides',
        url: 'https://support.microsoft.com/',
        icon: '🪟',
        category: 'Official Support'
      },
      {
        name: 'Ubuntu Documentation',
        description: 'Comprehensive Linux documentation and guides',
        url: 'https://ubuntu.com/tutorials',
        icon: '🐧',
        category: 'Linux Resources'
      },
      {
        name: 'TechNet Wiki',
        description: 'Microsoft TechNet community knowledge base',
        url: 'https://social.technet.microsoft.com/wiki/',
        icon: '📚',
        category: 'Knowledge Base'
      },
      {
        name: 'Stack Overflow',
        description: 'Programming and technical Q&A community',
        url: 'https://stackoverflow.com/',
        icon: '💻',
        category: 'Community'
      }
    ],
    communities: [
      {
        name: 'Reddit r/techsupport',
        description: 'Community for technical support and troubleshooting',
        url: 'https://www.reddit.com/r/techsupport/',
        icon: '🤝',
        category: 'Community Support'
      },
      {
        name: 'SuperUser',
        description: 'Q&A site for computer enthusiasts and power users',
        url: 'https://superuser.com/',
        icon: '👥',
        category: 'Q&A Community'
      },
      {
        name: "Tom's Hardware",
        description: 'Hardware reviews, news, and community forums',
        url: 'https://www.tomshardware.com/',
        icon: '🔧',
        category: 'Hardware'
      },
      {
        name: 'BleepingComputer',
        description: 'Security news and malware removal guides',
        url: 'https://www.bleepingcomputer.com/',
        icon: '🛡️',
        category: 'Security'
      }
    ],
    learning: [
      {
        name: 'CompTIA A+',
        description: 'Professional IT certification for hardware and software',
        url: 'https://www.comptia.org/certifications/a',
        icon: '🎓',
        category: 'Certification'
      },
      {
        name: 'Coursera IT Courses',
        description: 'Online IT and computer science courses',
        url: 'https://www.coursera.org/browse/business/it',
        icon: '📖',
        category: 'Online Learning'
      },
      {
        name: 'YouTube Tech Channels',
        description: 'Popular tech education channels',
        url: 'https://www.youtube.com/results?search_query=computer+repair+tutorial',
        icon: '📺',
        category: 'Video Learning'
      },
      {
        name: 'GitHub',
        description: 'Open source projects and code repositories',
        url: 'https://github.com/',
        icon: '🐙',
        category: 'Open Source'
      }
    ]
  }

  const renderLinkCard = (link: LinkItem) => (
    <div key={link.name} className='col-md-6 col-lg-4 mb-3'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-start mb-3'>
            <span className='display-6 me-3'>{link.icon}</span>
            <div className='flex-grow-1'>
              <h6 className='card-title mb-1'>{link.name}</h6>
              <span className='badge bg-secondary small'>{link.category}</span>
            </div>
          </div>
          <p className='card-text text-muted small mb-3'>{link.description}</p>
          <a
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
            className='btn btn-outline-primary btn-sm'
          >
            <FaExternalLinkAlt className='me-1' />
            Visit Site
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div className='container py-4'>
      {/* Hero Section */}
      <div className='row mb-5'>
        <div className='col-lg-8 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3'>
            Useful <span className='text-primary'>Links</span>
          </h1>
          <p className='lead text-muted'>
            Curated collection of essential tools, resources, and communities
            for computer maintenance and system recovery. These links will help
            you expand your knowledge and find additional support.
          </p>
        </div>
      </div>

      {/* Tools Section */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaTools className='text-primary me-2' size={24} />
          <h2 className='mb-0'>Essential Tools</h2>
        </div>
        <div className='row'>{links.tools.map(renderLinkCard)}</div>
      </section>

      {/* Resources Section */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaBook className='text-success me-2' size={24} />
          <h2 className='mb-0'>Learning Resources</h2>
        </div>
        <div className='row'>{links.resources.map(renderLinkCard)}</div>
      </section>

      {/* Communities Section */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaUsers className='text-info me-2' size={24} />
          <h2 className='mb-0'>Communities & Forums</h2>
        </div>
        <div className='row'>{links.communities.map(renderLinkCard)}</div>
      </section>

      {/* Learning Section */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaShieldAlt className='text-warning me-2' size={24} />
          <h2 className='mb-0'>Learning & Certification</h2>
        </div>
        <div className='row'>{links.learning.map(renderLinkCard)}</div>
      </section>

      {/* Additional Resources */}
      <section className='mb-5'>
        <div className='card bg-light'>
          <div className='card-body p-4'>
            <h3 className='mb-4'>Additional Resources</h3>
            <div className='row'>
              <div className='col-md-6'>
                <h5>Safety First</h5>
                <ul className='list-unstyled'>
                  <li className='mb-2'>
                    <strong>Always backup your data</strong> before attempting
                    any system repairs
                  </li>
                  <li className='mb-2'>
                    <strong>Use official sources</strong> for downloading tools
                    and software
                  </li>
                  <li className='mb-2'>
                    <strong>Test on non-critical systems</strong> when learning
                    new techniques
                  </li>
                  <li>
                    <strong>Keep tools updated</strong> to ensure compatibility
                    and security
                  </li>
                </ul>
              </div>
              <div className='col-md-6'>
                <h5>Best Practices</h5>
                <ul className='list-unstyled'>
                  <li className='mb-2'>
                    <strong>Document your steps</strong> when troubleshooting
                    complex issues
                  </li>
                  <li className='mb-2'>
                    <strong>Join communities</strong> to learn from others'
                    experiences
                  </li>
                  <li className='mb-2'>
                    <strong>Stay updated</strong> with the latest tools and
                    techniques
                  </li>
                  <li>
                    <strong>Share knowledge</strong> to help others in the
                    community
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section>
        <div className='alert alert-info' role='alert'>
          <h6 className='alert-heading'>Disclaimer</h6>
          <p className='mb-0'>
            These links are provided for educational and reference purposes. We
            are not affiliated with any of these sites. Always verify the
            authenticity of tools and resources before downloading or using
            them. Use these tools responsibly and at your own risk.
          </p>
        </div>
      </section>
    </div>
  )
}

export default UsefulLinksPage
