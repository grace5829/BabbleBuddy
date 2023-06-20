

//create api backend route to translate the lanagues?

import Link from "next/link";

export default function Home() {
  
  return (
    <main>
     <Link href="/image">Upload Image</Link>
     <Link href="/speech" className="mx-1.5">Record Voice</Link>
    </main>
  );
}
