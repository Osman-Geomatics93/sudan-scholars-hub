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
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactItem: {
    fontSize: 10,
    color: '#333333',
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 4,
    marginBottom: 10,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
  },
  dateRange: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    color: '#444444',
  },
  company: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333333',
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
  },
  institution: {
    fontSize: 11,
    fontFamily: 'Times-Italic',
    color: '#444444',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    fontSize: 10,
    marginRight: 15,
    marginBottom: 4,
  },
  languageRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    width: 100,
  },
  languageLevel: {
    fontSize: 10,
    color: '#444444',
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
  },
  certDetails: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    color: '#444444',
  },
});

function formatDate(date: Date | string | null | undefined, locale: string): string {
  if (!date) return '';
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
}

export function ClassicTemplate({ resume, locale }: TemplateProps): React.ReactElement {
  const isRTL = locale === 'ar';
  const labels = {
    summary: isRTL ? 'الملخص المهني' : 'Professional Summary',
    experience: isRTL ? 'الخبرة المهنية' : 'Professional Experience',
    education: isRTL ? 'التعليم' : 'Education',
    skills: isRTL ? 'المهارات' : 'Skills',
    languages: isRTL ? 'اللغات' : 'Languages',
    certifications: isRTL ? 'الشهادات والتراخيص' : 'Certifications & Licenses',
    present: isRTL ? 'الحالي' : 'Present',
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.fullName}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{resume.email}</Text>
            {resume.phone && <Text style={styles.contactItem}>| {resume.phone}</Text>}
            {resume.location && <Text style={styles.contactItem}>| {resume.location}</Text>}
          </View>
          <View style={styles.contactRow}>
            {resume.linkedIn && (
              <Link src={resume.linkedIn} style={styles.contactItem}>
                LinkedIn
              </Link>
            )}
            {resume.website && (
              <Link src={resume.website} style={styles.contactItem}>
                | Website
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.summary}</Text>
            <Text style={styles.summary}>
              {isRTL && resume.summaryAr ? resume.summaryAr : resume.summary}
            </Text>
          </View>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.experience}</Text>
            {resume.experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.position}</Text>
                  <Text style={styles.dateRange}>
                    {formatDate(exp.startDate, locale)} —{' '}
                    {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {exp.company}
                  {exp.location && `, ${exp.location}`}
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.education}</Text>
            {resume.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.degree}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={styles.dateRange}>
                    {formatDate(edu.startDate, locale)} —{' '}
                    {edu.current ? labels.present : formatDate(edu.endDate, locale)}
                  </Text>
                </View>
                <Text style={styles.institution}>
                  {edu.institution}
                  {edu.location && `, ${edu.location}`}
                  {edu.gpa && ` — GPA: ${edu.gpa}`}
                </Text>
                {edu.achievements && (
                  <Text style={styles.description}>{edu.achievements}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.skills}</Text>
            <View style={styles.skillsContainer}>
              {resume.skills.map((skill, index) => (
                <Text key={skill.id} style={styles.skillItem}>
                  • {skill.name}
                  {skill.level && ` (${skill.level})`}
                  {index < resume.skills.length - 1 ? '   ' : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.languages}</Text>
            {resume.languages.map((lang) => (
              <View key={lang.id} style={styles.languageRow}>
                <Text style={styles.languageName}>{lang.language}:</Text>
                <Text style={styles.languageLevel}>{lang.proficiency}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.certifications}</Text>
            {resume.certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certDetails}>
                  {cert.issuer}
                  {cert.issueDate && ` — ${formatDate(cert.issueDate, locale)}`}
                  {cert.credentialId && ` — ID: ${cert.credentialId}`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
