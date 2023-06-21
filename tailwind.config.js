/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{html,js}", "./app/*.{html,js}"],
  theme: {
    extend: {      
      fontFamily:{
      dynaPuff:['DynaPuff', 'cursive'],
      orbitron:['Orbitron', 'sans-serif'],
      caveat: ["Caveat", "cursive"],
      comicSans: ["Comic Sans MS", "cursive"],
      gillSans: ["Gill Sans, sans-serif"],
      markerFelt: ['Marker Felt, fantasy']
    },
  },
    
  },
  plugins: [],
}

