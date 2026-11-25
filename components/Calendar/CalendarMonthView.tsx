'use client';

import { useState, useMemo } from 'react';
import { CalendarReleaseItem } from './types';
import { parseLocalDate, formatFriendlyDate } from './calendarUtils';
import ReleaseCard from './ReleaseCard';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaGamepad, FaFilm, FaTv } from 'react-icons/fa6';

interface Props {
  items: CalendarReleaseItem[];
}

export default function CalendarMonthView({ items }: Props) {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selectedDayString, setSelectedDayString] = useState<string | null>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    currentDate
  );

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDayString(now.toISOString().split('T')[0]);
  };

  // Group items by 'YYYY-MM-DD'
  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarReleaseItem[]>();
    items.forEach(item => {
      const parsed = parseLocalDate(item.releaseDate);
      if (!parsed) return;
      const key = parsed.toISOString().split('T')[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return map;
  }, [items]);

  // Generate calendar days grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysGrid = useMemo(() => {
    const days: Array<{
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      items: CalendarReleaseItem[];
    }> = [];

    // Previous month padding days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const d = new Date(Date.UTC(year, month - 1, dayNum));
      const key = d.toISOString().split('T')[0];
      days.push({
        dayNumber: dayNum,
        dateString: key,
        isCurrentMonth: false,
        items: itemsByDate.get(key) || [],
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(Date.UTC(year, month, day));
      const key = d.toISOString().split('T')[0];
      days.push({
        dayNumber: day,
        dateString: key,
        isCurrentMonth: true,
        items: itemsByDate.get(key) || [],
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(Date.UTC(year, month + 1, day));
      const key = d.toISOString().split('T')[0];
      days.push({
        dayNumber: day,
        dateString: key,
        isCurrentMonth: false,
        items: itemsByDate.get(key) || [],
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayIndex, itemsByDate]);

  const todayString = new Date().toISOString().split('T')[0];

  const selectedDayItems = selectedDayString ? itemsByDate.get(selectedDayString) || [] : [];

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='space-y-8'>
      {/* Calendar Header Navigation */}
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4'>
        <div className='flex items-center gap-3'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground'>{monthName}</h2>
          <button
            onClick={goToToday}
            className='rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            Today
          </button>
        </div>

        <div className='flex items-center gap-1.5'>
          <button
            onClick={prevMonth}
            aria-label='Previous Month'
            className='rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted'
          >
            <BiChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            aria-label='Next Month'
            className='rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted'
          >
            <BiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className='grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground'>
        {weekDayLabels.map(day => (
          <div key={day} className='py-2'>
            {day}
          </div>
        ))}
      </div>

      {/* Grid of days */}
      <div className='grid grid-cols-7 gap-1 sm:gap-2'>
        {daysGrid.map(({ dayNumber, dateString, isCurrentMonth, items: dayItems }) => {
          const isToday = dateString === todayString;
          const isSelected = dateString === selectedDayString;
          const hasReleases = dayItems.length > 0;

          return (
            <button
              key={dateString}
              onClick={() => setSelectedDayString(dateString)}
              className={`relative flex min-h-[70px] flex-col rounded-xl p-1.5 text-left transition-all sm:min-h-[96px] sm:p-2 ${
                isSelected
                  ? 'border-2 border-primary bg-primary/10 shadow-lg'
                  : hasReleases
                    ? 'border border-border/80 bg-card hover:border-primary/50 hover:bg-card/90'
                    : 'border border-border/30 bg-card/30 hover:bg-card/50'
              } ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              {/* Day Header */}
              <div className='flex w-full items-center justify-between'>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isToday
                      ? 'bg-red-500 text-white'
                      : isSelected
                        ? 'text-primary-foreground bg-primary'
                        : 'text-foreground'
                  }`}
                >
                  {dayNumber}
                </span>

                {hasReleases && (
                  <span className='py-0.2 rounded-full bg-primary/20 px-1.5 text-[10px] font-bold text-primary'>
                    {dayItems.length}
                  </span>
                )}
              </div>

              {/* Day Release Chips / Indicators */}
              {hasReleases && (
                <div className='mt-1.5 flex w-full flex-col gap-1 overflow-hidden'>
                  {dayItems.slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      className='flex items-center gap-1 truncate rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground'
                    >
                      {item.mediaType === 'GAME' ? (
                        <FaGamepad size={9} className='shrink-0 text-emerald-400' />
                      ) : item.mediaType === 'SHOW' ? (
                        <FaTv size={9} className='shrink-0 text-purple-400' />
                      ) : (
                        <FaFilm size={9} className='shrink-0 text-sky-400' />
                      )}
                      <span className='truncate'>{item.name}</span>
                    </div>
                  ))}
                  {dayItems.length > 2 && (
                    <span className='pl-1 text-[10px] font-semibold text-muted-foreground'>
                      +{dayItems.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Section */}
      {selectedDayString && (
        <div className='mt-8 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-bold text-foreground'>
                Releases for {formatFriendlyDate(selectedDayString)}
              </h3>
              <p className='text-xs text-muted-foreground'>
                {selectedDayItems.length} title{selectedDayItems.length === 1 ? '' : 's'} scheduled
              </p>
            </div>
          </div>

          {selectedDayItems.length === 0 ? (
            <p className='py-6 text-center text-sm text-muted-foreground'>
              No releases scheduled for this date.
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {selectedDayItems.map(item => (
                <ReleaseCard key={`${item.mediaType}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
