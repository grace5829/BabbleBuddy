
"use client"
import {ThemeProvider} from 'next-themes'
import {useTheme} from "next-themes"
import Link from "next/link";
import ImagePage from './image/page';
export default function Home() {
  const {theme, setTheme}=useTheme()
  return (
    <ThemeProvider>

    <main>
     {/* <Link href="/image">Upload Image</Link> */}
     {/* <Link href="/speech" className="mx-1.5">Record Voice</Link> */}
    <ImagePage/>
   
   
    </main>
    </ThemeProvider>
  );
}
