import {
  getAllJobsRepository,
  getJobByIdRepository,
} from "../repositories/job.repository.js";

export const getAllJobsService = async () => {
  return getAllJobsRepository();
};

export const getJobByIdService = async (id: number) => {
  return getJobByIdRepository(id);
};