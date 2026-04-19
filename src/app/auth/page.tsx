import AuthWrapper from '@/components/auth/AuthWrapper';
import PhotonBeam from '@/components/ui/photon-beam';

export default function Auth() {
  return (
    <div className='relative flex min-h-screen w-full overflow-hidden bg-background'>
      {/* Background */}
      <div className='- absolute inset-0'>
        <PhotonBeam
          bloomRadius={0.5}
          bloomStrength={3.0}
          colorBg='#080808'
          colorLine='#0f5132'
          colorSignal='#22c55e'
          colorSignal2='#4ade80'
          colorSignal3='#16a34a'
          lineCount={50}
          signalCount={100}
          speedGlobal={0.345}
          spreadHeight={50}
          trailLength={3}
        />
      </div>

      {/* Content */}
      <div className='justify-right mr-20 ml-auto flex min-h-screen w-full max-w-xl items-center px-6'>
        <AuthWrapper />
      </div>
    </div>
  );
}
