import { ClothingCategory } from '@/interfaces/clothing';
import { icons } from './icons';

export const clothingData: ClothingCategory[] = [
  {
    id: 'action',
    name: 'Action',
    subCategories: [
      {
        id: 'action-tops',
        name: 'Tops',
        items: [
          {
            id: 'action-top-1',
            name: 'Tactical Vest',
            image: icons.personb,
            category: 'action',
            subCategory: 'tops',
            description: 'Military-style tactical vest for action heroes'
          },
          {
            id: 'action-top-2',
            name: 'Combat Jacket',
            image: icons.personb,
            category: 'action',
            subCategory: 'tops',
            description: 'Rugged combat jacket with multiple pockets'
          },
          {
            id: 'action-top-3',
            name: 'Hero T-Shirt',
            image: icons.personb,
            category: 'action',
            subCategory: 'tops',
            description: 'Fitted t-shirt with action movie logo'
          }
        ]
      },
      {
        id: 'action-bottoms',
        name: 'Bottoms',
        items: [
          {
            id: 'action-bottom-1',
            name: 'Cargo Pants',
            image: icons.personb,
            category: 'action',
            subCategory: 'bottoms',
            description: 'Tactical cargo pants with multiple pockets'
          },
          {
            id: 'action-bottom-2',
            name: 'Combat Shorts',
            image: icons.personb,
            category: 'action',
            subCategory: 'bottoms',
            description: 'Rugged combat shorts for mobility'
          }
        ]
      },
      {
        id: 'action-full',
        name: 'Full',
        items: [
          {
            id: 'action-full-1',
            name: 'Superhero Suit',
            image: icons.personb,
            category: 'action',
            subCategory: 'full',
            description: 'Complete superhero costume with cape'
          },
          {
            id: 'action-full-2',
            name: 'Tactical Jumpsuit',
            image: icons.personb,
            category: 'action',
            subCategory: 'full',
            description: 'Full-body tactical jumpsuit for special operations'
          }
        ]
      },
      {
        id: 'action-accessories',
        name: 'Accessories',
        items: [
          {
            id: 'action-acc-1',
            name: 'Combat Boots',
            image: icons.personb,
            category: 'action',
            subCategory: 'accessories',
            description: 'Heavy-duty combat boots'
          },
          {
            id: 'action-acc-2',
            name: 'Tactical Gloves',
            image: icons.personb,
            category: 'action',
            subCategory: 'accessories',
            description: 'Fingerless tactical gloves'
          },
          {
            id: 'action-acc-3',
            name: 'Aviator Sunglasses',
            image: icons.personb,
            category: 'action',
            subCategory: 'accessories',
            description: 'Classic aviator sunglasses'
          }
        ]
      }
    ]
  },
  {
    id: 'crime',
    name: 'Crime',
    subCategories: [
      {
        id: 'crime-tops',
        name: 'Tops',
        items: [
          {
            id: 'crime-top-1',
            name: 'Suit Jacket',
            image: icons.personb,
            category: 'crime',
            subCategory: 'tops',
            description: 'Elegant suit jacket for crime drama'
          },
          {
            id: 'crime-top-2',
            name: 'Detective Coat',
            image: icons.personb,
            category: 'crime',
            subCategory: 'tops',
            description: 'Long detective trench coat'
          }
        ]
      },
      {
        id: 'crime-bottoms',
        name: 'Bottoms',
        items: [
          {
            id: 'crime-bottom-1',
            name: 'Suit Pants',
            image: icons.personb,
            category: 'crime',
            subCategory: 'bottoms',
            description: 'Elegant suit pants for crime drama'
          },
          {
            id: 'crime-bottom-2',
            name: 'Detective Slacks',
            image: icons.personb,
            category: 'crime',
            subCategory: 'bottoms',
            description: 'Classic detective slacks'
          }
        ]
      },
      {
        id: 'crime-full',
        name: 'Full',
        items: [
          {
            id: 'crime-full-1',
            name: 'Mafia Suit',
            image: icons.personb,
            category: 'crime',
            subCategory: 'full',
            description: 'Complete mafia-style suit with tie'
          },
          {
            id: 'crime-full-2',
            name: 'Detective Outfit',
            image: icons.personb,
            category: 'crime',
            subCategory: 'full',
            description: 'Full detective outfit with hat and coat'
          }
        ]
      },
      {
        id: 'crime-accessories',
        name: 'Accessories',
        items: [
          {
            id: 'crime-acc-1',
            name: 'Fedora Hat',
            image: icons.personb,
            category: 'crime',
            subCategory: 'accessories',
            description: 'Classic fedora hat for detectives'
          },
          {
            id: 'crime-acc-2',
            name: 'Leather Holster',
            image: icons.personb,
            category: 'crime',
            subCategory: 'accessories',
            description: 'Leather shoulder holster'
          }
        ]
      }
    ]
  },
  {
    id: 'romance',
    name: 'Romance',
    subCategories: [
      {
        id: 'romance-tops',
        name: 'Tops',
        items: [
          {
            id: 'romance-top-1',
            name: 'Elegant Blouse',
            image: icons.untitled,
            category: 'romance',
            subCategory: 'tops',
            description: 'Elegant silk blouse for romantic scenes'
          },
          {
            id: 'romance-top-2',
            name: 'Dress Shirt',
            image: icons.personb,
            category: 'romance',
            subCategory: 'tops',
            description: 'Classic white dress shirt'
          }
        ]
      },
      {
        id: 'romance-bottoms',
        name: 'Bottoms',
        items: [
          {
            id: 'romance-bottom-1',
            name: 'Flowing Skirt',
            image: icons.untitled,
            category: 'romance',
            subCategory: 'bottoms',
            description: 'Flowing long skirt for romantic scenes'
          },
          {
            id: 'romance-bottom-2',
            name: 'Dress Pants',
            image: icons.personb,
            category: 'romance',
            subCategory: 'bottoms',
            description: 'Elegant dress pants'
          }
        ]
      },
      {
        id: 'romance-full',
        name: 'Full',
        items: [
          {
            id: 'romance-full-1',
            name: 'Evening Gown',
            image: icons.untitled,
            category: 'romance',
            subCategory: 'full',
            description: 'Elegant evening gown for romantic dinners'
          },
          {
            id: 'romance-full-2',
            name: 'Tuxedo',
            image: icons.personb,
            category: 'romance',
            subCategory: 'full',
            description: 'Classic tuxedo for formal occasions'
          }
        ]
      },
      {
        id: 'romance-accessories',
        name: 'Accessories',
        items: [
          {
            id: 'romance-acc-1',
            name: 'Pearl Necklace',
            image: icons.untitled,
            category: 'romance',
            subCategory: 'accessories',
            description: 'Elegant pearl necklace'
          },
          {
            id: 'romance-acc-2',
            name: 'Bow Tie',
            image: icons.personb,
            category: 'romance',
            subCategory: 'accessories',
            description: 'Classic black bow tie'
          }
        ]
      }
    ]
  }
];
