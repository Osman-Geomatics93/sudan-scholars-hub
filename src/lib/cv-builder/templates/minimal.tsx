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
    padding: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  contactRow: {
    fontSize: 10,
    color: '#555555',
    lineHeight: 1.6,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    marginVertical: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#333333',
    marginBottom: 12,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#333333',
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceHeader: {
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  company: {
    fontSize: 10,
    color: '#333333',
  },
  dateLocation: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#444444',
    marginTop: 5,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  institution: {
    fontSize: 10,
    color: '#333333',
  },
  skillsList: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
  },
  twoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  halfColumn: {
    width: '50%',
    marginBottom: 4,
  },
  languageItem: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 4,
  },
  certItem: {
    marginBottom: 10,
  },
  certName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  certDetails: {
    fontSize: 9,
    color: '#555555',
  },
});

function formatDate(date: Date | string | null | undefined, locale: string): string {
  if (!date) return '';
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
  return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
}

export function MinimalTemplate({ resume, locale }: TemplateProps): React.ReactElement {
  const isRTL = locale === 'ar';
  const labels = {
    summary: isRTL ? 'نبذة' : 'About',
    experience: isRTL ? 'الخبرة' : 'Experience',
    education: isRTL ? 'التعليم' : 'Education',
    skills: isRTL ? 'المهارات' : 'Skills',
    languages: isRTL ? 'اللغات' : 'Languages',
    certifications: isRTL ? 'الشهادات' : 'Certifications',
    present: isRTL ? 'الحالي' : 'Present',
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.fullName}</Text>
          <Text style={styles.contactRow}>
            {resume.email}
            {resume.phone && ` · ${resume.phone}`}
            {resume.location && ` · ${resume.location}`}
          </Text>
          {(resume.linkedIn || resume.website) && (
            <Text style={styles.contactRow}>
              {resume.linkedIn && (
                <Link src={resume.linkedIn}>LinkedIn</Link>
              )}
              {resume.linkedIn && resume.website && ' · '}
              {resume.website && (
                <Link src={resume.website}>Portfolio</Link>
              )}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        {resume.summary && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{labels.summary}</Text>
              <Text style={styles.summary}>
                {isRTL && resume.summaryAr ? resume.summaryAr : resume.summary}
              </Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{labels.experience}</Text>
              {resume.experience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.jobTitle}>{exp.position}</Text>
                    <Text style={styles.company}>{exp.company}</Text>
                    <Text style={styles.dateLocation}>
                      {formatDate(exp.startDate, locale)} —{' '}
                      {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                      {exp.location && ` · ${exp.location}`}
                    </Text>
                  </View>
                  {exp.description && (
                    <Text style={styles.description}>{exp.description}</Text>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{labels.education}</Text>
              {resume.education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                  <Text style={styles.degree}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text style={styles.institution}>{edu.institution}</Text>
                  <Text style={styles.dateLocation}>
                    {formatDate(edu.startDate, locale)} —{' '}
                    {edu.current ? labels.present : formatDate(edu.endDate, locale)}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                  </Text>
                  {edu.achievements && (
                    <Text style={styles.description}>{edu.achievements}</Text>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.skills}</Text>
            <Text style={styles.skillsList}>
              {resume.skills.map((skill) => skill.name).join(' · ')}
            </Text>
          </View>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.languages}</Text>
            <View style={styles.twoColumn}>
              {resume.languages.map((lang) => (
                <View key={lang.id} style={styles.halfColumn}>
                  <Text style={styles.languageItem}>
                    {lang.language}: {lang.proficiency}
                  </Text>
                </View>
              ))}
            </View>
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
                  {cert.issueDate && ` · ${formatDate(cert.issueDate, locale)}`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
