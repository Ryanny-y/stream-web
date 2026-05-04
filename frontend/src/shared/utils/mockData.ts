// Mock data for the guest pages (replaces real API until backend is connected)
import type { VideoSummary, Category } from '@/shared/types/api';

export const mockVideos: VideoSummary[] = [
  {
    id: '1',
    title: 'The Dark Horizon',
    description: 'A thrilling sci-fi epic about the last survivors of humanity navigating a dying universe.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80',
    duration: 7920, // 2h 12m
    genre: 'Sci-Fi',
    rating: 8.7,
    releaseDate: '2024-03-15',
    viewCount: 1240000,
  },
  {
    id: '2',
    title: 'Crimson Tide',
    description: 'A gripping underwater thriller where a lone submarine crew must make an impossible choice.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    duration: 6600, // 1h 50m
    genre: 'Action',
    rating: 8.2,
    releaseDate: '2024-01-20',
    viewCount: 980000,
  },
  {
    id: '3',
    title: 'Neon Requiem',
    description: 'In a city that never sleeps, a detective uncovers a conspiracy that shakes the foundations of power.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    duration: 8100, // 2h 15m
    genre: 'Drama',
    rating: 9.1,
    releaseDate: '2024-05-01',
    viewCount: 2100000,
  },
  {
    id: '4',
    title: 'Hollow Earth',
    description: 'Scientists discover a civilization living beneath the earth\'s surface with advanced technology.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    duration: 5400, // 1h 30m
    genre: 'Horror',
    rating: 7.4,
    releaseDate: '2024-02-14',
    viewCount: 650000,
  },
  {
    id: '5',
    title: 'The Last Comedian',
    description: 'A heartwarming comedy about a failed stand-up who stumbles into an unexpected journey.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    duration: 5760, // 1h 36m
    genre: 'Comedy',
    rating: 7.8,
    releaseDate: '2024-04-08',
    viewCount: 870000,
  },
  {
    id: '6',
    title: 'Oceans Apart',
    description: 'A breathtaking documentary following the world\'s most remote ocean ecosystems.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: 4800, // 1h 20m
    genre: 'Documentary',
    rating: 8.9,
    releaseDate: '2024-06-10',
    viewCount: 1560000,
  },
  {
    id: '7',
    title: 'Stellar Drift',
    description: 'An astronaut stranded in deep space must race against time using only a damaged AI.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    duration: 7200, // 2h
    genre: 'Sci-Fi',
    rating: 8.5,
    releaseDate: '2024-07-22',
    viewCount: 1890000,
  },
  {
    id: '8',
    title: 'Shadow Protocol',
    description: 'A covert operative goes rogue after discovering his handlers have been working for the enemy.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555086851-88f91beaf66d?w=800&q=80',
    duration: 7500, // 2h 5m
    genre: 'Action',
    rating: 7.9,
    releaseDate: '2024-08-15',
    viewCount: 730000,
  },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Action', description: 'High-octane thrills', thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80' },
  { id: '2', name: 'Drama', description: 'Deep emotional stories', thumbnailUrl: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=400&q=80' },
  { id: '3', name: 'Sci-Fi', description: 'Science and imagination', thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
  { id: '4', name: 'Horror', description: 'Fear at its finest', thumbnailUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80' },
  { id: '5', name: 'Comedy', description: 'Laughs guaranteed', thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80' },
  { id: '6', name: 'Documentary', description: 'Real world stories', thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
];
