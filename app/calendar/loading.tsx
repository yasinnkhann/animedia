export default function Loading() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center'>
      <div className='mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      <p className='text-sm text-muted-foreground'>Loading Release Calendar...</p>
    </div>
  );
}
