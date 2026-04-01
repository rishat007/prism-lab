import { Fragment } from 'react';
import { linkifyTextToParts } from '../../utils/linkify.js';

export default function LinkifiedText({ text, keyPrefix = 'link' }) {
  const parts = linkifyTextToParts(text);
  if (!parts.length) return <>{text ?? ''}</>;

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'link') {
          const anchorProps = part.external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {};
          return (
            <a key={`${keyPrefix}-${index}`} href={part.href} {...anchorProps}>
              {part.value}
            </a>
          );
        }
        return <Fragment key={`${keyPrefix}-${index}`}>{part.value}</Fragment>;
      })}
    </>
  );
}