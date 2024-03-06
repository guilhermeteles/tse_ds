// 'use client'

// import { Fragment } from 'react'
// import { Highlight } from 'prism-react-renderer'

// export function Fence({
//   children,
//   language,
// }: {
//   children: string
//   language: string
// }) {
//   return (
//     <Highlight
//       code={children.trimEnd()}
//       language={language}
//       theme={{ plain: {}, styles: [] }}
//     >
//       {({ className, style, tokens, getTokenProps }) => (
//         <pre className={className} style={style}>
//           <code>
//             {tokens.map((line, lineIndex) => (
//               <Fragment key={lineIndex}>
//                 {line
//                   .filter((token) => !token.empty)
//                   .map((token, tokenIndex) => (
//                     <span key={tokenIndex} {...getTokenProps({ token })} />
//                   ))}
//                 {'\n'}
//               </Fragment>
//             ))}
//           </code>
//         </pre>
//       )}
//     </Highlight>
//   )
// }
// Assuming 'use client' directive is part of your environment setup


/////////////////



// 'use client'

// import React, { useState, Fragment } from 'react';
// import { Highlight, themes } from 'prism-react-renderer';
// // import PrismTheme from 'prism-react-renderer/themes/github'; // Choose a theme as per your preference

// export function Fence({
//   children,
//   language,
// }: {
//   children: string;
//   language: string;
// }) {
//   // State to toggle between code view and rendered view
//   const [isCodeView, setIsCodeView] = useState(true);

//   // Function to toggle the view
//   const toggleView = () => setIsCodeView(!isCodeView);

//   // Tailwind classes for the toggle button
//   const buttonClass = 'inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

//   return (
//     <div>
//       <button onClick={toggleView} className={buttonClass}>
//         {isCodeView ? 'Show Rendered' : 'Show Code'}
//       </button>

//       {isCodeView ? (
//         // Displaying the code
//         <Highlight code={children.trimEnd()} language={language} theme={themes.jettwaveDark}>
//           {({ className, style, tokens, getTokenProps }) => (
//             <pre className={`${className} mt-4 overflow-x-auto`} style={style}>
//               <code>
//                 {tokens.map((line, lineIndex) => (
//                   <Fragment key={lineIndex}>
//                     {line.filter((token) => !token.empty).map((token, tokenIndex) => (
//                       <span key={tokenIndex} {...getTokenProps({ token })} />
//                     ))}
//                     {'\n'}
//                   </Fragment>
//                 ))}
//               </code>
//             </pre>
//           )}
//         </Highlight>
//       ) : (
//         // Rendering the code
//         <div className="mt-4" dangerouslySetInnerHTML={{ __html: children }} />
//       )}
//     </div>
//   );
// }
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Switch } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Fence({
  children,
  language,
  prefix = '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head><body>',
  suffix = '</body></html>',
}: {
  children: string;
  language: string;
  prefix?: string;
  suffix?: string;
}) {
  const [isCodeView, setIsCodeView] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!isCodeView && iframeRef.current) {
      const iframe: HTMLIFrameElement = iframeRef.current;
      let doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        const fullContent = `${prefix}${children}${suffix}`;
        const contentWithTailwind = `${fullContent}<script src="https://cdn.tailwindcss.com"></script>`;
        doc.write(contentWithTailwind);
        doc.close();
      }
    }
  }, [isCodeView, children, prefix, suffix]);

  return (
    <div>
      <Switch
        checked={isCodeView}
        onChange={setIsCodeView}
        className={classNames(
          isCodeView ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none'
        )}
      >
        <span className="sr-only">Toggle View</span>
        <span
          className={classNames(
            isCodeView ? 'translate-x-6' : 'translate-x-1',
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
          )}
        />
      </Switch>

      {isCodeView ? (
        <div className="mt-4">
          <Highlight code={children.trimEnd()} language={language} theme={themes.jettwaveDark}>
            {({ className, style, tokens, getTokenProps }) => (
              <pre className={`${className} overflow-x-auto`} style={style}>
                <code>
                  {tokens.map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line.filter((token) => !token.empty).map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                      {'\n'}
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            )}
          </Highlight>
        </div>
      ) : (
        <div className="mt-4">
          <iframe className="rounded-xl" ref={iframeRef} style={{ width: '100%', height: '500px', border: '1px solid black' }} title="Rendered Content"></iframe>
        </div>
      )
      }
    </div >
  );
}
