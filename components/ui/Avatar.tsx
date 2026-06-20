import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  initials?: string;
  size?: 'small' | 'middle' | 'large' | number;
  backgroundColor?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Avatar = ({
  src,
  initials,
  size = 'middle',
  backgroundColor = '#ccc',
  className = '',
  onClick,
  style,
}: AvatarProps) => {
  let sizeClass = 'w-8 h-8 text-sm';
  if (size === 'small') sizeClass = 'w-6 h-6 text-xs';
  if (size === 'large') sizeClass = 'w-10 h-10 text-base';

  const customSizeStyle =
    typeof size === 'number' ? { width: size, height: size, fontSize: size * 0.4 } : {};
  const mergedStyle = { ...customSizeStyle, ...style };

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: src ? 'transparent' : backgroundColor, ...mergedStyle }}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${sizeClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {src ? (
        <Image src={src} alt='Avatar' fill className='object-cover' />
      ) : (
        <span className='select-none font-medium text-white'>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
