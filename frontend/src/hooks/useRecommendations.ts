import { RecommendationRequest, RecommendationResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await axios.post(`${API_BASE_URL}/recommendations`, request)

  if (!response) {
    throw new Error('Failed to fetch recommendations');
  }

  return response.data;
}

export function useRecommendations() {
  return useMutation({
    mutationFn: fetchRecommendations,
  });
}