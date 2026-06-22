'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

interface Props {
  children?: ReactNode;
  closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [closeModal]);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current?.contains(e.target as Node)) {
      return;
    }
    closeModal();
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants: Variants = {
    hidden: {
      scale: 0.5,
      opacity: 0,
      y: 40,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      scale: 0.5,
      opacity: 0,
      y: 40,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      onClick={handleClickOutside}
      className='fixed left-0 top-0 z-[1] flex h-full w-full items-center justify-center overflow-auto bg-black/60 pt-20 backdrop-blur-sm'
      variants={backdropVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      <motion.div
        className='relative m-auto max-h-[85vh] w-[90vw] overflow-hidden rounded-2xl border border-white/10 bg-card/80 text-card-foreground shadow-2xl backdrop-blur-xl md:w-[70vw] lg:w-[50vw]'
        ref={contentRef}
        variants={modalVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <motion.button
          onClick={() => closeModal()}
          className='absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoClose className='h-5 w-5' />
        </motion.button>
        <div className='max-h-[85vh] overflow-y-auto scrollbar-hide'>{children}</div>
      </motion.div>
    </motion.section>
  );
};

export default Modal;
