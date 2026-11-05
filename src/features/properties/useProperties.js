import { useQuery } from '@tanstack/react-query';
import {
  fetchAllProperties,
  fetchCollectionBySlug,
  fetchCollections,
  fetchConsultants,
  fetchFeaturedProperties,
  fetchLocations,
  fetchProperties,
  fetchPropertyBySlug,
} from '../../services/api';

export function usePropertiesQuery(filters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
  });
}

export function useAllPropertiesQuery() {
  return useQuery({
    queryKey: ['properties', 'all'],
    queryFn: fetchAllProperties,
  });
}

export function useFeaturedPropertiesQuery(limit = 4) {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: () => fetchFeaturedProperties(limit),
  });
}

export function usePropertyDetailsQuery(slug) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => fetchPropertyBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCollectionsQuery() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });
}

export function useCollectionDetailsQuery(slug) {
  return useQuery({
    queryKey: ['collection', slug],
    queryFn: () => fetchCollectionBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useLocationsQuery() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });
}

export function useConsultantsQuery() {
  return useQuery({
    queryKey: ['consultants'],
    queryFn: fetchConsultants,
  });
}

