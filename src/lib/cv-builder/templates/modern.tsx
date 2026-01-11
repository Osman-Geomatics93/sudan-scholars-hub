import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import type { ResumeWithRelations } from '../pdf-generator';

interface TemplateProps {
  resume: ResumeWithRelations;
  locale: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#1e3a5f',
    padding: 20,
    color: '#ffffff',
  },
  main: {
    width: '65%',
    padding: 25,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  contactInfo: {
    marginTop: 15,
  },
  contactItem: {
    fontSize: 9,
    marginBottom: 6,
    color: '#e0e0e0',
  },
  contactLabel: {
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  sidebarSection: {
    marginTop: 20,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#4a90a4',
    paddingBottom: 5,
    marginBottom: 10,
  },
  skillItem: {
    fontSize: 9,
    color: '#e0e0e0',
    marginBottom: 4,
    paddingLeft: 8,
  },
  languageItem: {
    fontSize: 9,
    color: '#e0e0e0',
    marginBottom: 6,
  },
  languageName: {
    fontWeight: 'bold',
  },
  // Main content styles
  mainSection: {
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a5f',
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
    paddingBottom: 5,
    marginBottom: 10,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    marginBottom: 15,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  dateRange: {
    fontSize: 9,
    color: '#666666',
  },
  company: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.4,
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  institution: {
    fontSize: 10,
    color: '#444444',
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  certIssuer: {
    fontSize: 9,
    color: '#666666',
  },
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  projectTech: {
    fontSize: 8,
    color: '#666666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  projectLink: {
    fontSize: 8,
    color: '#4a90a4',
    marginTop: 2,
  },
  awardItem: {
    marginBottom: 8,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  awardIssuer: {
    fontSize: 9,
    color: '#666666',
  },
});

function formatDate(date: Date | string | null, locale: string): string {
  if (!date) return '';
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
}

export function ModernTemplate({ resume, locale }: TemplateProps): React.ReactElement {
  const isRTL = locale === 'ar';
  const labels = {
    contact: isRTL ? 'معلومات الاتصال' : 'Contact',
    skills: isRTL ? 'المهارات' : 'Skills',
    languages: isRTL ? 'اللغات' : 'Languages',
    summary: isRTL ? 'الملخص المهني' : 'Professional Summary',
    experience: isRTL ? 'الخبرة المهنية' : 'Experience',
    education: isRTL ? 'التعليم' : 'Education',
    certifications: isRTL ? 'الشهادات' : 'Certifications',
    projects: isRTL ? 'المشاريع' : 'Projects',
    awards: isRTL ? 'الجوائز والإنجازات' : 'Awards & Honors',
    present: isRTL ? 'الحالي' : 'Present',
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.name}>{resume.fullName}</Text>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <Text style={styles.sidebarTitle}>{labels.contact}</Text>
            <Text style={styles.contactItem}>{resume.email}</Text>
            {resume.phone && <Text style={styles.contactItem}>{resume.phone}</Text>}
            {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
            {resume.linkedIn && (
              <Link src={resume.linkedIn} style={styles.contactItem}>
                LinkedIn
              </Link>
            )}
            {resume.website && (
              <Link src={resume.website} style={styles.contactItem}>
                Website
              </Link>
            )}
          </View>

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{labels.skills}</Text>
              {resume.skills.map((skill) => (
                <Text key={skill.id} style={styles.skillItem}>
                  • {skill.name}
                  {skill.level && ` (${skill.level})`}
                </Text>
              ))}
            </View>
          )}

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>{labels.languages}</Text>
              {resume.languages.map((lang) => (
                <Text key={lang.id} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  {'\n'}
                  {lang.proficiency}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Summary */}
          {resume.summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{labels.summary}</Text>
              <Text style={styles.summary}>
                {isRTL && resume.summaryAr ? resume.summaryAr : resume.summary}
              </Text>
            </View>
          )}

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{labels.experience}</Text>
              {resume.experience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.dateRange}>
                      {formatDate(exp.startDate, locale)} -{' '}
                      {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                    </Text>
                  </View>
                  <Text style={styles.company}>
                    {exp.company}
                    {exp.location && ` | ${exp.location}`}
                  </Text>
                  {exp.description && (
                    <Text style={styles.description}>{exp.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{labels.education}</Text>
              {resume.education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.degree}>
                      {edu.degree} in {edu.field}
                    </Text>
                    <Text style={styles.dateRange}>
                      {formatDate(edu.startDate, locale)} -{' '}
                      {edu.current ? labels.present : formatDate(edu.endDate, locale)}
                    </Text>
                  </View>
                  <Text style={styles.institution}>
                    {edu.institution}
                    {edu.location && ` | ${edu.location}`}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </Text>
                  {edu.achievements && (
                    <Text style={styles.description}>{edu.achievements}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{labels.projects}</Text>
              {resume.projects.map((project) => (
                <View key={project.id} style={styles.projectItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    {(project.startDate || project.endDate) && (
                      <Text style={styles.dateRange}>
                        {project.startDate && formatDate(project.startDate, locale)}
                        {project.startDate && ' - '}
                        {project.current ? labels.present : project.endDate && formatDate(project.endDate, locale)}
                      </Text>
                    )}
                  </View>
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={styles.projectTech}>
                      {project.technologies.join(' • ')}
                    </Text>
                  )}
                  {project.description && (
                    <Text style={styles.description}>{project.description}</Text>
                  )}
                  {project.url && (
                    <Link src={project.url} style={styles.projectLink}>
                      {project.url}
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Awards & Honors */}
          {resume.awards && resume.awards.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{labels.awards}</Text>
              {resume.awards.map((award) => (
                <View key={award.id} style={styles.awardItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.awardTitle}>{award.title}</Text>
                    {award.date && (
                      <Text style={styles.dateRange}>
                        {formatDate(award.date, locale)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.awardIssuer}>{award.issuer}</Text>
                  {award.description && (
                    <Text style={styles.description}>{award.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>{labels.certifications}</Text>
              {resume.certifications.map((cert) => (
                <View key={cert.id} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>
                    {cert.issuer}
                    {cert.issueDate && ` | ${formatDate(cert.issueDate, locale)}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
