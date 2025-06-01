import { Model } from '@/interfaces/model';
import { icons } from './Icons';

// Mock data for models
export const modelData: Model[] = [
  {
    id: '1',
    name: 'Alex',
    description: 'Professional male model with experience in casual and formal wear.',
    gender: 'Male',
    thumbnailImage: icons.personb,
    images: [icons.personb, icons.personb, icons.personb],
    password: 'defaultPassword1'
  },
  {
    id: '2',
    name: 'Michael',
    description: 'Versatile male model specializing in sportswear and outdoor fashion.',
    gender: 'Male',
    thumbnailImage: icons.personb,
    images: [icons.personb, icons.personb, icons.personb],
    password: 'defaultPassword2'
  },
  {
    id: '3',
    name: 'Sophia',
    description: 'Fashion model with experience in high-end designer collections.',
    gender: 'Female',
    thumbnailImage: icons.untitled,
    images: [icons.untitled, icons.untitled, icons.untitled],
    password: 'defaultPassword3'
  },
  {
    id: '4',
    name: 'Emma',
    description: 'Versatile female model specializing in casual and everyday fashion.',
    gender: 'Female',
    thumbnailImage: icons.untitled,
    images: [icons.untitled, icons.untitled, icons.untitled],
    password: 'defaultPassword4'
  },
  {
    id: '5',
    name: 'Sam',
    description: 'Young model for children\'s clothing and accessories.',
    gender: 'Kids',
    thumbnailImage: icons.starb,
    images: [icons.starb, icons.starb, icons.starb],
    password: 'defaultPassword5'
  },
  {
    id: '6',
    name: 'Jamie',
    description: 'Child model for both casual and formal children\'s fashion.',
    gender: 'Kids',
    thumbnailImage: icons.starb,
    images: [icons.starb, icons.starb, icons.starb],
    password: 'defaultPassword6'
  }
];
