import { useRouter } from 'next/router';
import cardData from '../../data/cards.json';
import React from 'react';

interface Card {
  id: number;
  'Bank Number': number;
  'Card Number': string;
  Bank: string;
  Card: string;
  'Card Type': string;
}

const CardDetailPage = () => {
  const router = useRouter();

  if (!router.isReady) return null; // Wait until router is ready
  const { id } = router.query;

  const card = cardData.cards.find((c: Card) => c.id === Number(id));

  if (!card) {
    return <div className="p-10 text-center text-red-500">Card not found</div>;
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Card Details</h1>
      <div className="max-w-xl mx-auto bg-gray-100 rounded-lg shadow p-6 space-y-4">
        <div><strong>Bank:</strong> {card.Bank}</div>
        <div><strong>Card Number:</strong> {card['Card Number']}</div>
        <div><strong>Card Type:</strong> {card['Card Type']}</div>
        <div><strong>Card:</strong> {card.Card}</div>
        <div><strong>Bank Number:</strong> {card['Bank Number']}</div>
      </div>
      <button
        onClick={() => router.back()}
        className="mt-6 text-blue-600 hover:underline block mx-auto"
      >
        ← Back to Cards
      </button>
    </div>
  );
};

export default CardDetailPage;
