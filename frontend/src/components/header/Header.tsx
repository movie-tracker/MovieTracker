import useAuthentication from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

function Header() {
  const auth = useAuthentication();

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-slate-800 h-16">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
          </div>
          <div className="flex items-center lg:order-2 gap-2">
            {auth.isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => auth.logout()}
                className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Log out
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
