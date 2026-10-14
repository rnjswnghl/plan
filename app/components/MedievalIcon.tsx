export default function MedievalIcon({type='nib',className=''}:{type?:string,className?:string}){
 const paths:Record<string,React.ReactNode>={
  nib:<><path d="M6 26 12 9 25 4 28 17 12 27Z"/><path d="m6 26 11-11"/><circle cx="19" cy="13" r="2"/><path d="m24 4 5 5M6 26l-2 3 3-1"/></>,
  calendar:<><rect x="5" y="7" width="23" height="22" rx="2"/><path d="M5 13h23M10 4v6M23 4v6M10 18h3m5 0h5m-13 6h3m5 0h5"/></>,
  scroll:<><path d="M8 6h17c5 0 5 7 0 7h-3M8 6c-5 0-5 7 0 7h2V6M10 10v17h14M24 10v17c5 0 5-7 0-7h-3v7"/><path d="M14 14h6m-6 5h6"/></>,
  book:<><path d="M16 8C10 4 5 5 3 6v22c5-2 9-1 13 2 4-3 8-4 13-2V6c-5-2-9-1-13 2Zm0 0v22M7 12l5 1m-5 4 5 1m9-5 5-1m-5 6 5-1"/></>,
  hourglass:<><path d="M8 4h16M8 28h16M10 4v5c0 4 12 10 12 14v5M22 4v5c0 4-12 10-12 14v5M11 9h10M11 25l5-5 5 5"/></>,
  laurel:<><path d="M16 28C3 24 3 11 10 4m6 24c13-4 13-17 6-24M7 19c-7-1-6-6-6-6 5-1 7 3 6 6Zm-1-7C0 9 4 5 4 5c4 1 4 4 2 7Zm4 12c-7 2-8-4-8-4 4-2 7 0 8 4Zm15-5c7-1 6-6 6-6-5-1-7 3-6 6Zm1-7c6-3 2-7 2-7-4 1-4 4-2 7Zm-4 12c7 2 8-4 8-4-4-2-7 0-8 4Z"/></>
 };
 return <svg viewBox="0 0 32 32" className={'medieval-icon '+className} fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]??paths.nib}</svg>;
}
