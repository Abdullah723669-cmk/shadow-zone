'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/context/LanguageContext';
import styles from './about.module.css';

const Logo3D = dynamic(() => import('@/components/Logo3D'), { ssr: false });

const TEAM = [
  { name: 'Arif Hossain', role: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Nusrat Jahan', role: 'Head of Design', emoji: '👩‍🎨' },
  { name: 'Kamal Uddin', role: 'Operations Lead', emoji: '👨‍💻' },
  { name: 'Fatema Akter', role: 'Marketing Director', emoji: '👩‍💼' },
];

const VALUES = [
  { icon: '✨', titleKey: 'qualityFirst', descKey: 'qualityFirstDesc' },
  { icon: '🌍', titleKey: 'sustainableFashion', descKey: 'sustainableFashionDesc' },
  { icon: '💡', titleKey: 'innovation', descKey: 'innovationDesc' },
  { icon: '🤝', titleKey: 'customerCentric', descKey: 'customerCentricDesc' },
];

const MILESTONES = [
  { year: '2020', titleKey: 'theBeginning', descKey: 'theBeginningDesc' },
  { year: '2021', titleKey: 'onlineLaunch', descKey: 'onlineLaunchDesc' },
  { year: '2023', titleKey: 'kidsCollection', descKey: 'kidsCollectionDesc' },
  { year: '2025', titleKey: 'tenKOrders', descKey: 'tenKOrdersDesc' },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>{t('about.ourStory')}</span>
            <h1 className="heading-display heading-1">
              {t('about.storyTitle').split('Shadow Zone')[0]}<br /><span className="text-gradient">Shadow Zone</span>
            </h1>
            <p className={styles.heroDesc}>
              {t('about.storyDesc')}
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
              <h2 className="heading-display heading-3">{t('about.mission')}</h2>
              <p className="text-secondary mt-2">
                {t('about.missionDesc')}
              </p>
            </div>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>🔭</div>
              <h2 className="heading-display heading-3">{t('about.vision')}</h2>
              <p className="text-secondary mt-2">
                {t('about.visionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">{t('about.whatWeStandFor').split('Stand For')[0]}<span className="text-gradient">Stand For</span></h2>
            <p className="text-secondary mt-2">{t('about.coreValues')}</p>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{t(`about.${v.titleKey}`)}</h3>
                <p className={styles.valueDesc}>{t(`about.${v.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-display heading-2">{t('about.ourJourney').split('Journey')[0]}<span className="text-gradient">Journey</span></h2>
            <p className="text-secondary mt-2">{t('about.milestones')}</p>
          </div>
          <div className={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <div key={i} className={styles.timelineItem} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineCard}>
                  <span className={styles.timelineYear}>{m.year}</span>
                  <h3 className={styles.timelineTitle}>{t(`about.${m.titleKey}`)}</h3>
                  <p className={styles.timelineDesc}>{t(`about.${m.descKey}`)}</p>
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
            <h2 className="heading-display heading-2">{t('about.meetOurTeam').split('Team')[0]}<span className="text-gradient">Team</span></h2>
            <p className="text-secondary mt-2">{t('about.passionatePeople')}</p>
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
              { num: '60+', label: t('about.statsProducts') },
              { num: '10K+', label: t('about.statsHappyCustomers') },
              { num: '15', label: t('about.statsSubCategories') },
              { num: '99%', label: t('about.statsSatisfactionRate') },
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
