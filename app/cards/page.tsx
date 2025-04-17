// // pages/cards/index.tsx (or wherever CardsPage is)
// import Link from 'next/link';
// //import cardData from '../../data/cards.json';

// interface Card {
//   id: number;
//   'Bank Number': number;
//   'Card Number': string;
//   Bank: string;
//   Card: string;
//   'Card Type': string;
// }

// const CardsPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">My Cards</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {cardData.cards.map((card: Card) => (
//           <Link key={card.id} href={`/card/${card.id}`}>
//             <div className="relative cursor-pointer bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6 h-56 w-full flex flex-col justify-between hover:scale-105 transition-transform">
//               <div className="text-lg font-semibold">{card.Bank}</div>
//               <div className="text-xl font-bold tracking-widest">{card['Card Number']}</div>
//               <div className="flex justify-between text-sm mt-4">
//                 <div>
//                   <div className="uppercase font-medium text-gray-200">Card Type</div>
//                   <div>{card['Card Type']}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="uppercase font-medium text-gray-200">Card</div>
//                   <div>{card.Card}</div>
//                 </div>
//               </div>
//               <div className="absolute bottom-4 left-6 text-xs text-gray-200">
//                 Bank No: {card['Bank Number']}
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CardsPage;
