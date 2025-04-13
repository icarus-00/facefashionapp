import { Model } from '@/interfaces/model';
import { icons } from './icons';

// Mock data for models
export const modelData: Model[] = [
  {
    id: '1',
    name: 'Alex',
    description: 'Professional male model with experience in casual and formal wear.',
    gender: 'Male',
    thumbnailImage: icons.personb,
    images: [icons.personb, icons.personb, icons.personb]
  },
  {
    id: '2',
    name: 'Michael',
    description: 'Versatile male model specializing in sportswear and outdoor fashion.',
    gender: 'Male',
    thumbnailImage: icons.personb,
    images: [icons.personb, icons.personb, icons.personb]
  },
  {
    id: '3',
    name: 'Sophia',
    description: 'Fashion model with experience in high-end designer collections.',
    gender: 'Female',
    thumbnailImage: icons.untitled,
    images: [icons.untitled, icons.untitled, icons.untitled]
  },
  {
    id: '4',
    name: 'Emma',
    description: 'Versatile female model specializing in casual and everyday fashion.',
    gender: 'Female',
    thumbnailImage: icons.untitled,
    images: [icons.untitled, icons.untitled, icons.untitled]
  },
  {
    id: '5',
    name: 'Sam',
    description: 'Young model for children\'s clothing and accessories.',
    gender: 'Kids',
    thumbnailImage: icons.starb,
    images: [icons.starb, icons.starb, icons.starb]
  },
  {
    id: '6',
    name: 'Jamie',
    description: 'Child model for both casual and formal children\'s fashion.',
    gender: 'Kids',
    thumbnailImage: icons.starb,
    images: [icons.starb, icons.starb, icons.starb]
  }
];
