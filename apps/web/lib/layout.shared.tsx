import EmoteerLogo from '@/components/emoteer-logo';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span>
            <EmoteerLogo className='size-6' />
          </span>
          <span className='tracking-tight font-bold'>
            {appName}
          </span>
        </>
      ),
    },
    githubUrl,
  };
}
