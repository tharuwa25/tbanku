// import { useRouter } from 'next/router';
// //import cardData from '../../public/data/cards.json';

// interface Card {
//   id: number;
//   'Bank Number': number;
//   'Card Number': string;
//   Bank: string;
//   Card: string;
//   'Card Type': string;
// }

// const CardDetailPage = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   const card = cardData.cards.find((c: Card) => c.id === Number(id));

//   if (!card) {
//     return <div className="p-10 text-red-500">Card not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold mb-4 text-gray-800">{card.Bank} - Card Details</h1>
//         <div className="space-y-2 text-gray-700">
//           <div><strong>Bank Number:</strong> {card['Bank Number']}</div>
//           <div><strong>Card Number:</strong> {card['Card Number']}</div>
//           <div><strong>Bank:</strong> {card.Bank}</div>
//           <div><strong>Card:</strong> {card.Card}</div>
//           <div><strong>Card Type:</strong> {card['Card Type']}</div>
//         </div>
//         <button onClick={() => router.back()} className="inline-block mt-6 text-indigo-600 hover:underline">
//           ← Back to Cards
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CardDetailPage;
