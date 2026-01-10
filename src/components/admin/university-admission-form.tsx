'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Save, ArrowLeft, Loader2, School, Calendar, GraduationCap, Sun } from 'lucide-react';
import {
  turkishCities,
  certificateTypes,
  certificateCategories,
  applicationTypes,
  calendarTypes,
  programDurations,
  instructionLanguages,
} from '@/lib/admissions-data';
import { getUniversitiesByCity, TurkishUniversity } from '@/lib/turkish-universities';

interface UniversityAdmissionFormData {
  universityNameEn: string;
  universityNameTr: string;
  universityNameAr: string;
  city: string;
  cityAr: string;
  degree: 'bachelor' | 'master' | 'phd' | 'all';
  specialization: string;
  registrationStart: string;
  registrationEnd: string;
  resultsDate: string;
  acceptedCertificates: string[];
  detailsUrl: string;
  applicationType: 'yos' | 'direct' | 'sat' | 'turkiye-burslari' | 'graduate-institute' | 'online-portal' | 'ales-based';
  localRanking: number;
  applicationFee: number | null;
  applicationFeeCurrency: 'TRY' | 'USD' | 'EUR';
  isFreeApplication: boolean;
  isActive: boolean;
  // New fields
  calendarType: 'bachelor' | 'masters-phd' | 'summer';
  programDuration: string;
  languageOfInstruction: string[];
}

interface UniversityAdmissionFormProps {
  initialData?: Partial<UniversityAdmissionFormData>;
  admissionId?: string;
}

export function UniversityAdmissionForm({ initialData, admissionId }: UniversityAdmissionFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isEditing = !!admissionId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<TurkishUniversity[]>([]);

  const [formData, setFormData] = useState<UniversityAdmissionFormData>({
    universityNameEn: initialData?.universityNameEn || '',
    universityNameTr: initialData?.universityNameTr || '',
    universityNameAr: initialData?.universityNameAr || '',
    city: initialData?.city || '',
    cityAr: initialData?.cityAr || '',
    degree: initialData?.degree || 'bachelor',
    specialization: initialData?.specialization || '',
    registrationStart: initialData?.registrationStart
      ? new Date(initialData.registrationStart).toISOString().split('T')[0]
      : '',
    registrationEnd: initialData?.registrationEnd
      ? new Date(initialData.registrationEnd).toISOString().split('T')[0]
      : '',
    resultsDate: initialData?.resultsDate
      ? new Date(initialData.resultsDate).toISOString().split('T')[0]
      : '',
    acceptedCertificates: initialData?.acceptedCertificates || [],
    detailsUrl: initialData?.detailsUrl || '',
    applicationType: initialData?.applicationType || 'yos',
    localRanking: initialData?.localRanking || 1,
    applicationFee: initialData?.applicationFee || null,
    applicationFeeCurrency: initialData?.applicationFeeCurrency || 'TRY',
    isFreeApplication: initialData?.isFreeApplication ?? true,
    isActive: initialData?.isActive ?? true,
    // New fields
    calendarType: initialData?.calendarType || 'bachelor',
    programDuration: initialData?.programDuration || '',
    languageOfInstruction: initialData?.languageOfInstruction || ['Turkish'],
  });

  // Update filtered universities when city changes
  useEffect(() => {
    if (formData.city) {
      const universities = getUniversitiesByCity(formData.city);
      setFilteredUniversities(universities);
    } else {
      setFilteredUniversities([]);
    }
  }, [formData.city]);

  const handleCityChange = (cityValue: string) => {
    const city = turkishCities.find((c) => c.value === cityValue);
    if (city) {
      setFormData((prev) => ({
        ...prev,
        city: city.value,
        cityAr: city.labelAr,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        city: '',
        cityAr: '',
      }));
    }
  };

  const handleUniversitySelect = (universityId: string) => {
    if (!universityId) return;

    const university = filteredUniversities.find((u) => u.id === universityId);
    if (university) {
      // Auto-fill university names from selected university
      setFormData((prev) => ({
        ...prev,
        universityNameEn: university.nameEn,
        universityNameTr: university.nameTr,
        universityNameAr: university.nameAr,
        localRanking: university.ranking || prev.localRanking,
      }));
    }
  };

  const handleCertificateToggle = (certValue: string) => {
    setFormData((prev) => ({
      ...prev,
      acceptedCertificates: prev.acceptedCertificates.includes(certValue)
        ? prev.acceptedCertificates.filter((c) => c !== certValue)
        : [...prev.acceptedCertificates, certValue],
    }));
  };

  const handleLanguageToggle = (langValue: string) => {
    setFormData((prev) => ({
      ...prev,
      languageOfInstruction: prev.languageOfInstruction.includes(langValue)
        ? prev.languageOfInstruction.filter((l) => l !== langValue)
        : [...prev.languageOfInstruction, langValue],
    }));
  };

  const handleFreeApplicationToggle = (isFree: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isFreeApplication: isFree,
      applicationFee: isFree ? null : prev.applicationFee || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/admin/university-admissions/${admissionId}`
        : '/api/admin/university-admissions';

      const method = isEditing ? 'PUT' : 'POST';

      const dataToSend = {
        ...formData,
        registrationStart: new Date(formData.registrationStart).toISOString(),
        registrationEnd: new Date(formData.registrationEnd).toISOString(),
        resultsDate: new Date(formData.resultsDate).toISOString(),
        applicationFee: formData.isFreeApplication ? null : formData.applicationFee,
        applicationFeeCurrency: formData.isFreeApplication ? null : formData.applicationFeeCurrency,
        specialization: formData.specialization || null,
        programDuration: formData.calendarType === 'summer' ? formData.programDuration || null : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save admission');
      }

      router.push(`/${locale}/admin/university-admissions`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calendarTypeIcons = {
    bachelor: GraduationCap,
    'masters-phd': School,
    summer: Sun,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Calendar Type Selection */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Calendar className="h-5 w-5 text-primary-600" />
          Calendar Type
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Select the type of calendar this admission belongs to
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {calendarTypes.map((type) => {
            const Icon = calendarTypeIcons[type.value as keyof typeof calendarTypeIcons];
            const isSelected = formData.calendarType === type.value;
            return (
              <label
                key={type.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="calendarType"
                  value={type.value}
                  checked={isSelected}
                  onChange={(e) => setFormData({ ...formData, calendarType: e.target.value as any })}
                  className="sr-only"
                />
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{type.labelEn}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                    {type.labelAr}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* University Info */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <School className="h-5 w-5 text-primary-600" />
          University Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Step 1: City Selection */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Step 1: Select City *
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select City</option>
              {turkishCities.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.labelEn} - {city.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: University Reference (Optional) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Step 2: University Reference (Optional)
            </label>
            <select
              disabled={!formData.city}
              onChange={(e) => handleUniversitySelect(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">
                {formData.city
                  ? `Select from ${filteredUniversities.length} universities`
                  : 'First select a city'}
              </option>
              {filteredUniversities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.nameEn} ({uni.type === 'state' ? 'State' : 'Foundation'})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Selecting auto-fills names and ranking. You can still edit manually.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              University Name (English) *
            </label>
            <input
              type="text"
              value={formData.universityNameEn}
              onChange={(e) => setFormData({ ...formData, universityNameEn: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              University Name (Turkish) *
            </label>
            <input
              type="text"
              value={formData.universityNameTr}
              onChange={(e) => setFormData({ ...formData, universityNameTr: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              اسم الجامعة (عربي) *
            </label>
            <input
              type="text"
              value={formData.universityNameAr}
              onChange={(e) => setFormData({ ...formData, universityNameAr: e.target.value })}
              required
              dir="rtl"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Degree *
            </label>
            <select
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value as any })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
              <option value="all">All Degrees</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Specialization (Optional)
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g., Engineering, Medicine"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Local Ranking *
            </label>
            <input
              type="number"
              min="1"
              value={formData.localRanking}
              onChange={(e) => setFormData({ ...formData, localRanking: parseInt(e.target.value) || 1 })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Language of Instruction */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Language of Instruction *
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Select all languages used for instruction at this university
        </p>

        <div className="flex flex-wrap gap-3">
          {instructionLanguages.map((lang) => (
            <label
              key={lang.value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                formData.languageOfInstruction.includes(lang.value)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.languageOfInstruction.includes(lang.value)}
                onChange={() => handleLanguageToggle(lang.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lang.labelEn}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400" dir="rtl">
                ({lang.labelAr})
              </span>
            </label>
          ))}
        </div>
        {formData.languageOfInstruction.length === 0 && (
          <p className="mt-2 text-sm text-red-500">Please select at least one language</p>
        )}
      </div>

      {/* Program Duration (only for Summer) */}
      {formData.calendarType === 'summer' && (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Sun className="h-5 w-5 text-orange-500" />
            Summer Program Details
          </h2>

          <div className="max-w-md">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Program Duration
            </label>
            <select
              value={formData.programDuration}
              onChange={(e) => setFormData({ ...formData, programDuration: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select Duration</option>
              {programDurations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.labelEn} - {duration.labelAr}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Important Dates
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Registration Start *
            </label>
            <input
              type="date"
              value={formData.registrationStart}
              onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Registration End *
            </label>
            <input
              type="date"
              value={formData.registrationEnd}
              onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Results Date *
            </label>
            <input
              type="date"
              value={formData.resultsDate}
              onChange={(e) => setFormData({ ...formData, resultsDate: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Accepted Certificates */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Accepted Certificates *
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Select all certificates accepted by this university. Categories are shown based on the selected calendar type.
        </p>

        <div className="space-y-6">
          {certificateCategories
            .filter((category) => category.forCalendarTypes.includes(formData.calendarType))
            .map((category) => {
              const categoryCerts = certificateTypes.filter((cert) =>
                category.certificates.includes(cert.value)
              );
              if (categoryCerts.length === 0) return null;

              return (
                <div key={category.category} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                    <span>{category.labelEn}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                      ({category.labelAr})
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {categoryCerts.map((cert) => (
                      <label
                        key={cert.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                          formData.acceptedCertificates.includes(cert.value)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.acceptedCertificates.includes(cert.value)}
                          onChange={() => handleCertificateToggle(cert.value)}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {cert.labelEn}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400" dir="rtl">
                            {cert.labelAr}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
        {formData.acceptedCertificates.length === 0 && (
          <p className="mt-2 text-sm text-red-500">Please select at least one certificate</p>
        )}
      </div>

      {/* Application Details */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Application Details
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Application Type *
            </label>
            <select
              value={formData.applicationType}
              onChange={(e) => setFormData({ ...formData, applicationType: e.target.value as any })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {applicationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.labelEn} - {type.labelAr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Details URL *
            </label>
            <input
              type="url"
              value={formData.detailsUrl}
              onChange={(e) => setFormData({ ...formData, detailsUrl: e.target.value })}
              required
              placeholder="https://university.edu.tr/admission"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Application Fee */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Application Fee
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="feeType"
                checked={formData.isFreeApplication}
                onChange={() => handleFreeApplicationToggle(true)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Free Application</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="feeType"
                checked={!formData.isFreeApplication}
                onChange={() => handleFreeApplicationToggle(false)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Paid Application</span>
            </label>
          </div>

          {!formData.isFreeApplication && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fee Amount *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.applicationFee || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, applicationFee: parseFloat(e.target.value) || null })
                  }
                  required={!formData.isFreeApplication}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency *
                </label>
                <select
                  value={formData.applicationFeeCurrency}
                  onChange={(e) =>
                    setFormData({ ...formData, applicationFeeCurrency: e.target.value as any })
                  }
                  required={!formData.isFreeApplication}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="TRY">TRY (Turkish Lira)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Status</h2>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
            Active (visible on public calendar)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="submit"
          disabled={
            loading ||
            formData.acceptedCertificates.length === 0 ||
            formData.languageOfInstruction.length === 0
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
