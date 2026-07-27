// import { Button } from '../../components/Button';
// import { useState } from 'react';
// import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

// export interface PagerProps {
//   pages: JSX.Element[];
// }

// export function Pager({ pages }: PagerProps) {
//   const [pageIdx, setPageIdx] = useState<number>(0);

//   const incIdx = () => setPageIdx((idx) => (idx + 1) % pages.length);
//   const decIdx = () => setPageIdx((idx) => (idx - 1 + pages.length) % pages.length);

//   return (
//     <div className="h-full w-full p-5 text-lg">
//       {pages[pageIdx]}
//       <div className="absolute m-5 bottom-0 right-0">
//         <Button
//           className="bg-black h-12 w-12"
//           icon={IoIosArrowBack}
//           onClick={decIdx}
//           size="icon"
//           disabled={pageIdx === 0}
//         />
//         <Button
//           className="bg-black h-12 w-12"
//           icon={IoIosArrowForward}
//           onClick={incIdx}
//           size="icon"
//           disabled={pageIdx === pages.length - 1}
//         />
//       </div>
//     </div>
//   );
// }

export function Pager() {
  return <div>hi</div>;
}
