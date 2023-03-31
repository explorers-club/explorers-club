// Write me a hook called useDomainCookie that allows me to get and set cookies for the current top level domain that page is running on that are only accessible within that top level domain.
// useDomainCookie.ts
import { useState, useEffect } from 'react';

type SetCookieOptions = {
  expires?: Date;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

function getTopLevelDomain(): string {
  const domainParts = window.location.hostname.split('.');
  if (domainParts.length > 1) {
    return domainParts.slice(-2).join('.');
  }
  return domainParts[0];
}

function setCookie(
  name: string,
  value: string,
  options: SetCookieOptions = {}
): void {
  const { expires, path, secure, sameSite } = options;
  const domain = getTopLevelDomain();
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  cookie += `; domain=${domain}`;
  if (expires) cookie += `; expires=${expires.toUTCString()}`;
  if (path) cookie += `; path=${path}`;
  if (secure) cookie += '; secure';
  if (sameSite) cookie += `; samesite=${sameSite}`;

  document.cookie = cookie;
}

function getCookie(name: string): string | null {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  if (!cookieValue) return null;
  return decodeURIComponent(cookieValue.split('=')[1]);
}

export function useDomainCookie(
  name: string
): [string | null, (value: string, options?: SetCookieOptions) => void] {
  const [value, setValue] = useState<string | null>(() => getCookie(name));

  useEffect(() => {
    setValue(getCookie(name));
  }, [name]);

  const setCookieWrapper = (value: string, options?: SetCookieOptions) => {
    setCookie(name, value, options);
    setValue(value);
  };

  return [value, setCookieWrapper];
}
