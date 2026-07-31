export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 22C6 18 10 15 16 14C14 12 12 10 12 8C12 5 14 3 18 3C22 3 25 5 26 8C27 10 26 12 24 14C30 15 34 18 36 22"
        stroke="#C7A96B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="22" r="2.5" stroke="#C7A96B" strokeWidth="1" />
      <circle cx="30" cy="22" r="2.5" stroke="#C7A96B" strokeWidth="1" />
    </svg>
  );
}
