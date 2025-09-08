'use client'

import { Heart, Sparkles, Users, Star } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import { aboutStyles } from './about.styles'

export function About() {
  const { t } = useTranslation()
  
  return (
    <section 
      id="about"
      className={aboutStyles.section}
    >
      <div className={aboutStyles.backgroundBlurs}>
        <div className={aboutStyles.blur1}></div>
        <div className={aboutStyles.blur2}></div>
      </div>
      
      <div className={aboutStyles.container}>
        <div className={aboutStyles.header}>
          <div className={aboutStyles.badge}>
            <Heart className="w-4 h-4" />
            <span>{t.about.badge}</span>
          </div>
          <h2 className={aboutStyles.title}>
            {t.about.title}
          </h2>
          <p 
            className={aboutStyles.mainText}
            dangerouslySetInnerHTML={{ __html: t.about.mainText }}
          />
        </div>
        
        <div className={aboutStyles.content}>
          <div className={aboutStyles.textSection}>
            <p 
              className={aboutStyles.secondaryText}
              dangerouslySetInnerHTML={{ __html: t.about.secondaryText }}
            />
          </div>
          
          <div className={aboutStyles.grid}>
            <div className={aboutStyles.card}>
              <div className={`${aboutStyles.iconContainer} ${aboutStyles.iconGradients.innovation}`}>
                <Sparkles className={`${aboutStyles.icon} ${aboutStyles.iconColors.innovation}`} />
              </div>
              <h4 className={aboutStyles.cardTitle}>{t.about.values.innovation.title}</h4>
              <p className={aboutStyles.cardDescription}>{t.about.values.innovation.description}</p>
            </div>
            <div className={aboutStyles.card}>
              <div className={`${aboutStyles.iconContainer} ${aboutStyles.iconGradients.community}`}>
                <Users className={`${aboutStyles.icon} ${aboutStyles.iconColors.community}`} />
              </div>
              <h4 className={aboutStyles.cardTitle}>{t.about.values.community.title}</h4>
              <p className={aboutStyles.cardDescription}>{t.about.values.community.description}</p>
            </div>
            <div className={aboutStyles.card}>
              <div className={`${aboutStyles.iconContainer} ${aboutStyles.iconGradients.quality}`}>
                <Star className={`${aboutStyles.icon} ${aboutStyles.iconColors.quality}`} />
              </div>
              <h4 className={aboutStyles.cardTitle}>{t.about.values.quality.title}</h4>
              <p className={aboutStyles.cardDescription}>{t.about.values.quality.description}</p>
            </div>
          </div>
        </div>
        
        <div className={aboutStyles.missionSection}>
          <div className={aboutStyles.missionIconContainer}>
            <div className={aboutStyles.missionIcon}>
              <Heart className="w-8 h-8 text-[#D78E59]" />
            </div>
          </div>
          <h3 className={aboutStyles.missionTitle}>{t.about.mission.title}</h3>
          <p className={aboutStyles.missionDescription}>
            {t.about.mission.description}
          </p>
        </div>
      </div>
    </section>
  )
}