/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            spacing: {
                headerHeight: '',
            },
            backgroundImage: {
                'hero-pattern':
                    'linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(/assets/images/main_thumbnail.png)',
            },
            colors: {
                primary: '#827062',
                secondary: '#A69689',
                grey: '#00000080',
                white: '#FFFFFF',
                black: '#000000',
                error: '#F51D1D',
                success: '#87d068',
                progress: '#2db7f5',
                'hover-header': '#D9D9D940',
            },
            borderRadius: {
                10: '10px',
                50: '50px',
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
