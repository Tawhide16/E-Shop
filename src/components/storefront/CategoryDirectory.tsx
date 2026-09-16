import React from 'react';
import { useStore } from '../../context/StoreContext';

export const CategoryDirectorySection: React.FC = () => {
  const { navigateToProduct, navigateToShop } = useStore();

  const handleLinkClick = (link: string) => {
    const l = link.toLowerCase();
    if (l.includes('legging')) {
      navigateToShop({ category: 'Leggings', search: l.includes('black') ? 'black' : '' });
    } else if (l.includes('sports bra') || l.includes('bra')) {
      navigateToShop({ category: 'Sports Bras' });
    } else if (l.includes('short')) {
      navigateToShop({ category: 'Shorts' });
    } else if (l.includes('shirt') || l.includes('stringer') || l.includes('baselayer')) {
      navigateToShop({ category: 'Tops' });
    } else if (l.includes('women')) {
      navigateToShop({ gender: 'women' });
    } else if (l.includes('men')) {
      navigateToShop({ gender: 'men' });
    } else {
      navigateToShop({ search: link });
    }
  };

  const directoryColumns = [
    {
      title: "WOMEN'S LEGGINGS",
      links: [
        'Gym Leggings',
        'Leggings With Pockets',
        'High Waisted Leggings',
        'Scrunch Bum Leggings',
        'Black Leggings',
        'Flare Leggings',
        'Seamless Leggings'
      ]
    },
    {
      title: "WOMEN'S GYMWEAR",
      links: [
        "Women's Gym Wear",
        "Women's Gym Shorts",
        'Running Shorts',
        'Sports Bras',
        'High Impact Sports Bras',
        'Black Sports Bras',
        'Matching Sets',
        'Loungewear'
      ]
    },
    {
      title: "MEN'S GYMWEAR",
      links: [
        "Men's Gymwear",
        "Men's Gym Shorts",
        'Shorts with Pockets',
        "Men's Running Shorts",
        'Gym Shirts',
        'Sleeveless T-Shirts',
        'Gym Stringers',
        "Men's Baselayers"
      ]
    },
    {
      title: 'ACCESSORIES',
      links: [
        "Women's Underwear",
        "Men's Underwear",
        'Workout Bags',
        'Duffel Bags',
        'Gym Socks',
        'Crew Socks',
        'Caps',
        'Beanies'
      ]
    }
  ];

  return (
    <section className="bg-gray-50 border-t border-b border-gray-100 py-12 font-sans w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {directoryColumns.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-extrabold uppercase tracking-wider text-black mb-3 text-xs font-mono">
                {col.title}
              </h4>
              <ul className="space-y-2 font-semibold text-gray-600">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <button 
                      onClick={() => handleLinkClick(link)}
                      className="hover:text-black hover:underline cursor-pointer text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
