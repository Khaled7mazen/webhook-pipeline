import { getDeliveriesByJobIdRepository } from "../repositories/delivery.repository.js";

export const getDeliveriesByJobIdService = async (jobId: number) => {
  return getDeliveriesByJobIdRepository(jobId);
};