'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import styles from './about.module.css';

const Logo3D = dynamic(() => import('@/components/Logo3D'), { ssr: false });

const TEAM = [
  { name: 'Arif Hossain', role: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Nusrat Jahan', role: 'Head of Design', emoji: '👩‍🎨' },
  { name: 'Kamal Uddin', role: 'Operations Lead', emoji: '👨‍💻' },
  { name: 'Fatema Akter', role: 'Marketing Director', emoji: '👩‍💼' },
];

const VALUES = [
  { icon: '✨', title: 'Quality First', desc: 'Every stitch, every fabric is chosen with care. We never compromise on the quality of our garments.' },
  { icon: '🌍', title: 'Sustainable Fashion', desc: 'We source eco-friendly materials and follow ethical manufacturing practices to protect our planet.' },
  { icon: '💡', title: 'Innovation', desc: 'From smart sizing tools to AI-powered recommendations, we push the boundaries of online fashion retail.' },
  { icon: '🤝', title: 'Customer Centric', desc: 'Your satisfaction is our top priority. We listen, adapt, and deliver beyond expectations.' },
];

const MILESTONES = [
  { year: '2020', title: 'The Beginning', desc: 'Shadow Zone was born from a small workshop in Dhaka with a dream to redefine readymade fashion.' },
  { year: '2021', title: 'Online Launch', desc: 'Launched our e-commerce platform, bringing premium fashion to doorsteps across Bangladesh.' },
  { year: '2023', title: 'Kids Collection', desc: 'Expanded our catalog with a vibrant kids collection, becoming a one-stop family fashion brand.' },
  { year: '2025', title: '10,000+ Orders', desc: 'Crossed 10,000 happy customers and growing, with plans to expand internationally.' },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>Our Story</span>
            <h1 className="heading-display heading-1">
              The Face Behind <br /><span className="text-gradient">Shadow Zone</span>
            </h1>
            <p className={styles.heroDesc}>
              Born in the heart of Bangladesh, Shadow Zone is more than a clothing brand — 
              it&apos;s a movement to make premium readymade fashion accessible to every family. 
              We blend timeless craftsmanship with modern design to create garments that speak confidence.
            </p>
          </div>
          <div className={styles.heroRight}>
            <Suspense fallback={null}>
              <Logo3D size="large" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>🎯</div>
              <h2 className="heading-display heading-3">Our Mission</h2>
              <p className="text-secondary mt-2">
                To provide high-quality, affordable readymade garments for Men, Ladies, and Kids 
                — empowering every individual to express themselves through fashion without breaking the bank.
              </p>
            </div>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>🔭</div>
              <h2 className="heading-display heading-3">Our Vision</h2>
              <p className="text-secondary mt-2">
                To become Bangladesh&apos;s most trusted online fashion destination, known for 
                innovation, quality, and an unmatched customer experience that sets global standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">What We <span className="text-gradient">Stand For</span></h2>
            <p className="text-secondary mt-2">The core values driving everything we do</p>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">Our <span className="text-gradient">Journey</span></h2>
            <p className="text-secondary mt-2">Key milestones that shaped who we are</p>
          </div>
          <div className={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <div key={i} className={styles.timelineItem} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineCard}>
                  <span className={styles.timelineYear}>{m.year}</span>
                  <h3 className={styles.timelineTitle}>{m.title}</h3>
                  <p className={styles.timelineDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">Meet Our <span className="text-gradient">Team</span></h2>
            <p className="text-secondary mt-2">The passionate people behind the brand</p>
          </div>
          <div className={styles.teamGrid}>
            {TEAM.map((t, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{t.emoji}</div>
                <h3 className={styles.teamName}>{t.name}</h3>
                <p className={styles.teamRole}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { num: '60+', label: 'Products' },
              { num: '10K+', label: 'Happy Customers' },
              { num: '15', label: 'Sub-Categories' },
              { num: '99%', label: 'Satisfaction Rate' },
            ].map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
