'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, ChevronUp, ChevronDown, Search, Filter, X, Calendar, DollarSign, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UniversityAdmission,
  getRegistrationStatus,
  certificateTypes,
  applicationTypes,
  turkishCities,
} from '@/lib/admissions-data';

interface AdmissionsTableProps {
  admissions: UniversityAdmission[];
  locale: string;
}

type SortField = 'universityNameEn' | 'city' | 'registrationStart' | 'registrationEnd' | 'resultsDate' | 'localRanking';
type SortDirection = 'asc' | 'desc';

export function AdmissionsTable({ admissions, locale }: AdmissionsTableProps) {
  const isRTL = locale === 'ar';

  // State for sorting
  const [sortField, setSortField] = useState<SortField>('registrationEnd');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const [hideEnded, setHideEnded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...admissions];

    // Apply filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.universityNameEn.toLowerCase().includes(query) ||
          item.universityNameTr.toLowerCase().includes(query) ||
          item.universityNameAr.includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.cityAr.includes(query)
      );
    }

    if (selectedCity) {
      result = result.filter((item) => item.city === selectedCity);
    }

    if (selectedCertificate) {
      result = result.filter((item) => item.acceptedCertificates.includes(selectedCertificate));
    }

    if (hideEnded) {
      result = result.filter((item) => {
        const status = getRegistrationStatus(item.registrationStart, item.registrationEnd);
        return status !== 'ended';
      });
    }

    if (freeOnly) {
      result = result.filter((item) => item.isFreeApplication);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'universityNameEn':
          comparison = a.universityNameEn.localeCompare(b.universityNameEn);
          break;
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'registrationStart':
        case 'registrationEnd':
        case 'resultsDate':
          comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
          break;
        case 'localRanking':
          comparison = a.localRanking - b.localRanking;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [admissions, searchQuery, selectedCity, selectedCertificate, hideEnded, freeOnly, sortField, sortDirection]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'ending-soon':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'upcoming':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'ended':
        return 'bg-gray-50 dark:bg-gray-800/50';
      default:
        return '';
    }
  };

  // Get certificate label
  const getCertificateLabel = (cert: string) => {
    const found = certificateTypes.find((c) => c.value === cert);
    return found ? (isRTL ? found.labelAr : found.labelEn) : cert;
  };

  // Get application type label
  const getApplicationTypeLabel = (type: string) => {
    const found = applicationTypes.find((t) => t.value === type);
    return found ? (isRTL ? found.labelAr : found.labelEn) : type;
  };

  // Get city label
  const getCityLabel = (city: string, cityAr: string) => {
    return isRTL ? cityAr : city;
  };

  // Render sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-300" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary-600" />
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCertificate('');
    setHideEnded(false);
    setFreeOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedCertificate || hideEnded || freeOnly;

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Toggle Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن الجامعة...' : 'Search university...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
              >
                <Filter className="h-4 w-4" />
                {isRTL ? 'الفلاتر' : 'Filters'}
              </button>

              {/* Hide Ended Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideEnded}
                    onChange={(e) => setHideEnded(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${hideEnded ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${hideEnded ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')}`} />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {isRTL ? 'اخفاء المفاضلات المنتهية' : 'Hide ended'}
                </span>
              </label>

              {/* Free Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={freeOnly}
                    onChange={(e) => setFreeOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${freeOnly ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${freeOnly ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')}`} />
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {isRTL ? 'المجانية فقط' : 'Free only'}
                </span>
              </label>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{isRTL ? 'اختر المدينة' : 'Select City'}</option>
              {turkishCities.map((city) => (
                <option key={city.value} value={city.value}>
                  {isRTL ? city.labelAr : city.labelEn}
                </option>
              ))}
            </select>

            {/* Certificate Filter */}
            <select
              value={selectedCertificate}
              onChange={(e) => setSelectedCertificate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{isRTL ? 'الشهادة المقبولة' : 'Accepted Certificate'}</option>
              {certificateTypes.map((cert) => (
                <option key={cert.value} value={cert.value}>
                  {isRTL ? cert.labelAr : cert.labelEn}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="whitespace-nowrap">
                <X className="h-4 w-4 me-1" />
                {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {isRTL
          ? `عدد النتائج: ${filteredAndSortedData.length}`
          : `${filteredAndSortedData.length} results found`}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('universityNameEn')}
                >
                  <div className="flex items-center gap-1">
                    {isRTL ? 'اسم الجامعة' : 'University'}
                    <SortIcon field="universityNameEn" />
                  </div>
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isRTL ? 'اسم الجامعة بالعربي' : 'Arabic Name'}
                </th>
                <th
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('city')}
                >
                  <div className="flex items-center gap-1">
                    {isRTL ? 'المدينة' : 'City'}
                    <SortIcon field="city" />
                  </div>
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isRTL ? 'الدرجة' : 'Degree'}
                </th>
                <th
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('registrationStart')}
                >
                  <div className="flex items-center gap-1">
                    {isRTL ? 'بدء التسجيل' : 'Start'}
                    <SortIcon field="registrationStart" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('registrationEnd')}
                >
                  <div className="flex items-center gap-1">
                    {isRTL ? 'انتهاء التسجيل' : 'End'}
                    <SortIcon field="registrationEnd" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('resultsDate')}
                >
                  <div className="flex items-center gap-1">
                    {isRTL ? 'النتائج' : 'Results'}
                    <SortIcon field="resultsDate" />
                  </div>
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isRTL ? 'الشهادات المقبولة' : 'Certificates'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isRTL ? 'التفاصيل' : 'Details'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isRTL ? 'نوع التقديم' : 'Type'}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isRTL ? 'رسوم التقديم' : 'Fee'}
                </th>
                <th
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('localRanking')}
                >
                  <div className="flex items-center gap-1">
                    {isRTL ? 'الترتيب المحلي' : 'Ranking'}
                    <SortIcon field="localRanking" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {isRTL ? 'لا يوجد مفاضلات' : 'No admissions found'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((admission, index) => {
                  const status = getRegistrationStatus(admission.registrationStart, admission.registrationEnd);
                  return (
                    <tr
                      key={admission.id}
                      className={`${getStatusClass(status)} hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-50 font-medium">
                        {admission.universityNameEn}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {admission.universityNameAr}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {getCityLabel(admission.city, admission.cityAr)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info" className="text-xs">
                          {isRTL
                            ? admission.degree === 'bachelor'
                              ? 'بكالوريوس'
                              : admission.degree === 'master'
                              ? 'ماجستير'
                              : admission.degree === 'phd'
                              ? 'دكتوراه'
                              : 'الكل'
                            : admission.degree.charAt(0).toUpperCase() + admission.degree.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatDate(admission.registrationStart)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatDate(admission.registrationEnd)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatDate(admission.resultsDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {admission.acceptedCertificates.slice(0, 3).map((cert) => (
                            <Badge key={cert} variant="default" className="text-xs">
                              {getCertificateLabel(cert)}
                            </Badge>
                          ))}
                          {admission.acceptedCertificates.length > 3 && (
                            <Badge variant="default" className="text-xs">
                              +{admission.acceptedCertificates.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={admission.detailsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          {isRTL ? 'التفاصيل' : 'Details'}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            admission.applicationType === 'yos'
                              ? 'warning'
                              : admission.applicationType === 'sat'
                              ? 'success'
                              : 'info'
                          }
                          className="text-xs"
                        >
                          {getApplicationTypeLabel(admission.applicationType)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {admission.isFreeApplication ? (
                          <Badge variant="success" className="text-xs">
                            <Gift className="h-3 w-3 me-1" />
                            {isRTL ? 'مجاني' : 'Free'}
                          </Badge>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                            <DollarSign className="h-3 w-3" />
                            {admission.applicationFee} {admission.applicationFeeCurrency || 'TRY'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            admission.localRanking <= 5
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : admission.localRanking <= 15
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {admission.localRanking}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
