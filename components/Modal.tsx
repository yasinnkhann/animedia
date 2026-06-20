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
      className='fixed left-0 top-0 z-[1] block h-full w-full overflow-auto bg-black bg-black/[0.4] pt-20'
      variants={backdropVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      <motion.div
        className='relative m-auto max-h-[85vh] w-[70vw] overflow-scroll rounded-xl border border-border bg-card p-4 text-card-foreground shadow-2xl scrollbar-hide'
        ref={contentRef}
        variants={modalVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <motion.button
          onClick={() => closeModal()}
          className='float-right'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoClose className='h-6 w-6 text-muted-foreground transition duration-300 hover:text-foreground' />
        </motion.button>
        {children}
      </motion.div>
    </motion.section>
  );
};

export default Modal;
