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
        description: "Download oficial e informações do Hiren's BootCD",
        url: 'https://www.hirensbootcd.org/',
        icon: '💿',
        category: 'Ferramenta Principal'
      },
      {
        name: 'Recuva',
        description: 'Software profissional de recuperação de arquivos',
        url: 'https://www.ccleaner.com/recuva',
        icon: '🔄',
        category: 'Recuperação de Dados'
      },
      {
        name: 'GParted',
        description:
          'Editor de partições gratuito para gerenciar discos graficamente',
        url: 'https://gparted.org/',
        icon: '💾',
        category: 'Gerenciamento de Disco'
      },
      {
        name: 'TestDisk',
        description: 'Software poderoso de recuperação de dados',
        url: 'https://www.cgsecurity.org/wiki/TestDisk',
        icon: '🔍',
        category: 'Recuperação de Dados'
      }
    ],
    resources: [
      {
        name: 'Suporte Microsoft',
        description:
          'Suporte oficial do Windows e guias de solução de problemas',
        url: 'https://support.microsoft.com/',
        icon: '🪟',
        category: 'Suporte Oficial'
      },
      {
        name: 'Documentação Ubuntu',
        description: 'Documentação e tutoriais completos sobre Linux',
        url: 'https://ubuntu.com/tutorials',
        icon: '🐧',
        category: 'Recursos Linux'
      },
      {
        name: 'TechNet Wiki',
        description: 'Base de conhecimento da comunidade Microsoft TechNet',
        url: 'https://social.technet.microsoft.com/wiki/',
        icon: '📚',
        category: 'Base de Conhecimento'
      }
    ],
    communities: [
      {
        name: 'Reddit r/techsupport',
        description: 'Comunidade para suporte técnico e solução de problemas',
        url: 'https://www.reddit.com/r/techsupport/',
        icon: '🤝',
        category: 'Suporte Comunitário'
      },
      {
        name: 'SuperUser',
        description:
          'Site de perguntas e respostas para entusiastas e usuários avançados',
        url: 'https://superuser.com/',
        icon: '👥',
        category: 'Comunidade de Q&A'
      },
      {
        name: "Tom's Hardware",
        description: 'Análises de hardware, notícias e fóruns da comunidade',
        url: 'https://www.tomshardware.com/',
        icon: '🔧',
        category: 'Hardware'
      },
      {
        name: 'BleepingComputer',
        description: 'Notícias de segurança e guias de remoção de malware',
        url: 'https://www.bleepingcomputer.com/',
        icon: '🛡️',
        category: 'Segurança'
      }
    ],
    learning: [
      {
        name: 'CompTIA A+',
        description: 'Certificação profissional de TI para hardware e software',
        url: 'https://www.comptia.org/certifications/a',
        icon: '🎓',
        category: 'Certificação'
      },
      {
        name: 'Cursos de TI - Coursera',
        description: 'Cursos online de TI e ciência da computação',
        url: 'https://www.coursera.org/browse/business/it',
        icon: '📖',
        category: 'Aprendizado Online'
      },
      {
        name: 'Canais de Tecnologia no YouTube',
        description: 'Canais populares de educação tecnológica',
        url: 'https://www.youtube.com/results?search_query=tutorial+de+reparo+de+computador',
        icon: '📺',
        category: 'Aprendizado em Vídeo'
      },
      {
        name: 'GitHub',
        description: 'Projetos de código aberto e repositórios de código',
        url: 'https://github.com/',
        icon: '🐙',
        category: 'Código Aberto'
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
            Visitar site
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div className='container py-4'>
      {/* Seção Principal */}
      <div className='row mb-5'>
        <div className='col-lg-8 mx-auto text-center'>
          <h1 className='display-4 fw-bold mb-3'>
            <span className='text-primary'>Links</span> Úteis
          </h1>
          <p className='lead text-muted'>
            Coleção cuidadosamente selecionada de ferramentas, recursos e
            comunidades essenciais para manutenção de computadores e recuperação
            de sistemas. Esses links irão ajudar a expandir o conhecimento e
            encontrar suporte adicional.
          </p>
        </div>
      </div>

      {/* Ferramentas Essenciais */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaTools className='text-primary me-2' size={24} />
          <h2 className='mb-0'>Ferramentas Essenciais</h2>
        </div>
        <div className='row'>{links.tools.map(renderLinkCard)}</div>
      </section>

      {/* Recursos de Aprendizado */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaBook className='text-success me-2' size={24} />
          <h2 className='mb-0'>Recursos de Aprendizado</h2>
        </div>
        <div className='row'>{links.resources.map(renderLinkCard)}</div>
      </section>

      {/* Comunidades e Fóruns */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaUsers className='text-info me-2' size={24} />
          <h2 className='mb-0'>Comunidades e Fóruns</h2>
        </div>
        <div className='row'>{links.communities.map(renderLinkCard)}</div>
      </section>

      {/* Aprendizado e Certificação */}
      <section className='mb-5'>
        <div className='d-flex align-items-center mb-4'>
          <FaShieldAlt className='text-warning me-2' size={24} />
          <h2 className='mb-0'>Aprendizado e Certificação</h2>
        </div>
        <div className='row'>{links.learning.map(renderLinkCard)}</div>
      </section>

      {/* Recursos Adicionais */}
      <section className='mb-5'>
        <div className='card bg-light'>
          <div className='card-body p-4'>
            <h3 className='mb-4'>Recursos Adicionais</h3>
            <div className='row'>
              <div className='col-md-6'>
                <h5>Segurança em Primeiro Lugar</h5>
                <ul className='list-unstyled text-start'>
                  <li className='mb-2'>
                    <strong>Sempre faça backup dos seus dados</strong> antes de
                    tentar qualquer reparo no sistema
                  </li>
                  <li className='mb-2'>
                    <strong>Use fontes oficiais</strong> para baixar ferramentas
                    e softwares
                  </li>
                  <li className='mb-2'>
                    <strong>Teste em sistemas não críticos</strong> ao aprender
                    novas técnicas
                  </li>
                  <li>
                    <strong>Mantenha as ferramentas atualizadas</strong> para
                    garantir compatibilidade e segurança
                  </li>
                </ul>
              </div>
              <div className='col-md-6'>
                <h5>Boas Práticas</h5>
                <ul className='list-unstyled text-start'>
                  <li className='mb-2'>
                    <strong>Documente seus passos</strong> ao solucionar
                    problemas complexos
                  </li>
                  <li className='mb-2'>
                    <strong>Participe de comunidades</strong> para aprender com
                    a experiência dos outros
                  </li>
                  <li className='mb-2'>
                    <strong>Mantenha-se atualizado</strong> com as últimas
                    ferramentas e técnicas
                  </li>
                  <li>
                    <strong>Compartilhe conhecimento</strong> para ajudar outras
                    pessoas na comunidade
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aviso Legal */}
      <section>
        <div className='alert alert-info' role='alert'>
          <h6 className='alert-heading'>Aviso Legal</h6>
          <p className='mb-0'>
            Esses links são fornecidos para fins educacionais e de referência.
            Não temos afiliação com nenhum desses sites. Sempre verifique a
            autenticidade das ferramentas e recursos antes de fazer download ou
            usá-los. Use essas ferramentas com responsabilidade e por sua conta
            e risco.
          </p>
        </div>
      </section>
    </div>
  )
}

export default UsefulLinksPage
