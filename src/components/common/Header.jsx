// import { Link } from "react-router-dom";

// const Header = ({ title }) => {
//     return (
//         <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
//             <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
//                 {/* Left Side: Logo & Name - Clickable */}
//                 <Link to="/" className='flex items-center space-x-3 cursor-pointer'>
//                     <img src='/CrowdIQ-logo2.jpg' alt='CrowdIQ Logo' className='h-8 w-8' />
//                     <span className='text-xl font-bold text-gray-100 hover:text-blue-400 transition'>C r o w d I Q</span>
//                 </Link>

//                 {/* Right Side: Page Title */}
//                 <h1 className='text-2xl font text-gray-100'>{title}</h1>
//             </div>
//         </header>
//     );
// };

// export default Header;

import { Link } from "react-router-dom";

const Header = ({ title }) => {
    return (
        // Fix the header height so it doesn’t grow when the logo is larger
        <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 h-20">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            
            {/* Left Side: Logo & Name - Clickable */}
            <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            {/* Bigger logo, but still fitting inside the 20px-high header */}
            <img 
                src="/Artboard 7-8.png" 
                alt="CrowdIQ Logo" 
                className="h-24 w-24 object-contain"
            />
            <span className="text-xl font-bold text-gray-100 hover:text-blue-400 transition">
                C r o w d I Q
            </span>
            </Link>

            {/* Right Side: Page Title */}
            <h1 className="text-2xl text-gray-100">{title}</h1>
        </div>
        </header>
    );
};

export default Header;

