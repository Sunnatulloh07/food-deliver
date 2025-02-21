'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function SocialLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      Cookies.set('access_token_user', accessToken as string, {
        secure: true,
        expires: 1/48
      });
      Cookies.set('refresh_token_user', refreshToken as string,{
        secure: true,
        expires: 2 
      });

      router.push('/');
    }
  }, [router, searchParams]);

  return (
    <div className="p-4">
      <h1>Social Login in progress...</h1>
    </div>
  );
}
