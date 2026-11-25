import { Metadata } from 'next';
import CalendarClient from '@/components/Calendar/CalendarClient';

export const metadata: Metadata = {
  title: 'Release Calendar | AniMedia',
  description:
    'Track upcoming movie releases, TV show premieres, and video game launch dates in one place.',
};

export default function CalendarPage() {
  return <CalendarClient />;
}
