'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BiDuplicate } from 'react-icons/bi';
import { motion } from 'framer-motion';

interface Props {
  collectionId: string;
}

export default function CloneCollectionButton({ collectionId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClone = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/collections/${collectionId}/clone`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to clone collection');

      toast.success('Collection cloned successfully!');
      router.push(`/collection/${data.collectionId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClone}
      disabled={isLoading}
      className='flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg disabled:opacity-50'
    >
      <BiDuplicate size={20} />
      {isLoading ? 'Cloning...' : 'Clone Collection'}
    </motion.button>
  );
}
