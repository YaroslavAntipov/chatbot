'use client'
import { useGetUserQuery } from '@/store/api/authApi';
import React from 'react';
import Loader from '../components/Loader';
import PricingBadge from '../components/PricingBadge';

const UserProfile: React.FC = () => {
  const { data: user, isLoading } = useGetUserQuery();

  if (!user || isLoading) {
    return <Loader />;
  }

  const [name, surname] = user.username.split(' ');

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">{user.username}'s Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="block text-gray-700">{name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Surname:</label>
          <p className="block text-gray-700">{surname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="block text-gray-700">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pricing Plan:</label>
          <PricingBadge plan={user.pricingPlan || 'No plan bought'} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
