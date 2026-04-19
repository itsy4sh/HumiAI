import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/seperator';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function AuthWrapper() {
  return (
    <div className='w-fit'>
      <Tabs className='gap-0' defaultValue='signIn'>
        <div className='m-0 p-0'>
          <TabsList className='bg-transparent'>
            <TabsTrigger
              className='border-t border-l data-[state=active]:bg-background data-[state=active]:shadow-none'
              value='signIn'
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              className='border-x border-t data-[state=active]:bg-background data-[state=active]:shadow-none'
              value='signUp'
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
        </div>
        <div className='z-10 items-stretch overflow-hidden border bg-background'>
          <div className='flex-1 border-r'>
            <TabsContent className='h-full p-5' value='signIn'>
              <h1 className='font-heading text-lg'>Sign In</h1>
              <p className='mt-1 text-muted-foreground text-sm'>
                Enter your email below to login to your account
              </p>
              <SignIn />
            </TabsContent>
            <TabsContent className='h-full p-5' value='signUp'>
              <h1 className='font-heading text-lg'>Sign Up</h1>
              <p className='mt-1 text-muted-foreground text-sm'>
                Enter your email below to create an account
              </p>
              <SignUp />
              <Separator className='mt-5 mb-3' />
              <p className='mt-1 flex items-center gap-2 text-muted-foreground text-xs'>
                <Checkbox aria-setsize={2} />
                <span>By signing up, you agree to the Terms of Service</span>
              </p>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
