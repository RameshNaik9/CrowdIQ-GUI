const Header = ({ title }) => {
    return (
        <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
            <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
                {/* Left Side: Logo & Name */}
                <div className='flex items-center space-x-3'>
                    <img src='/CrowdIQ-logo2.jpg' alt='CrowdIQ Logo' className='h-8 w-8' /> {/* Update the path if needed */}
                    <span className='text-xl font-bold text-gray-100'>C r o w d I Q</span>
                </div>

                {/* Right Side: Page Title */}
                <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
            </div>
        </header>
    );
};

export default Header;
