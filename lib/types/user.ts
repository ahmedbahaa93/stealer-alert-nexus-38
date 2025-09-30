export interface UserProfile {
  avatar: string | null;
  personal_info: {
    full_name: string;
    email: string;
    phone_number: string;
    gender: string;
    date_of_birth: string;
    location: {
      country: string;
      city: string;
      address: string;
    };
  };
  professional_info: {
    current_job_title: string;
    company_organization_name: string;
    industry_field_of_work: string;
    years_of_experience: number;
  };
  education_info: {
    highest_education_level: string;
    field_of_study: string;
    graduation_year: number;
    university_institution_name: string;
  };
}
