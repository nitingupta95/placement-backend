import { CompanyRepository } from "./company.repository";

const repo = new CompanyRepository();

export class CompanyService {
  async getProfile(companyId: number) {
    const company = await repo.findById(companyId);
    if (!company) throw new Error("Company not found");
    const { password, ...companyData } = company;
    return companyData;
  }

  async updateProfile(companyId: number, data: any) {
    const company = await repo.updateCompany(companyId, data);
    const { password, ...companyData } = company;
    return companyData;
  }

  async getDashboardStats(companyId: number) {
    return repo.getDashboardStats(companyId);
  }

  async getCompanyJobs(companyId: number) {
    return repo.getCompanyJobs(companyId);
  }

  async getAnalytics(companyId: number) {
    return repo.getAnalytics(companyId);
  }

  async updateLogoUrl(companyId: number, logoUrl: string) {
    const company = await repo.updateLogoUrl(companyId, logoUrl);
    const { password, ...companyData } = company;
    return companyData;
  }
}
