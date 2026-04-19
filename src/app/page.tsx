import FocusButton from '@/components/ui/focus-button';
import { PixelImage } from '@/components/ui/pixel-image';

export default function Home() {
  return (
    <section className='py-14 md:py-30'>
      <div className='mx-auto max-w-5xl space-y-8 px-6 md:space-y-12'>
        <div className='w-full1'>
          <PixelImage src='/homePage.png' />
        </div>
        <div className='grid gap-6 md:grid-cols-2 md:gap-12'>
          <div className='space-y-5'>
            <h2 className='font-heading text-4xl'>
              Ren — a quieter way to feel better
            </h2>
            <FocusButton href='/auth'>Get Started</FocusButton>
          </div>
          <div className='pt-1.5'>
            <h1 className='pb-2 font-heading text-xl'>What we do</h1>
            <p>
              We combine the warmth of human support with the scale of AI —
              delivering real-time emotional assistance, personalized coping
              tools, and clinical-grade insights to anyone, anywhere, at any
              time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
