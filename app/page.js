
"use client"
import {ThemeProvider} from 'next-themes'
import {useTheme} from "next-themes"
import Link from "next/link";

export default function Home() {
  const {theme, setTheme}=useTheme()
  return (
    <ThemeProvider>

    <main>
     <Link href="/image">Upload Image</Link>
     <Link href="/speech" className="mx-1.5">Record Voice</Link>

   
    </main>
    </ThemeProvider>
  );
}
