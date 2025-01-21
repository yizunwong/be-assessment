import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

/**
 * The main navigation bar for the application.
 *
 * This component renders the logo, tagline, navigation links, and user dropdown.
 * If the user is not authenticated, a login button is rendered instead of the
 * user dropdown.
 *
 * The user dropdown contains a link to the user's profile and a button to log
 * out.
 * If the user is in the process of logging out, a loading spinner is displayed
 * instead of the log out button.
 * The user dropdown is toggleable via the button with the user's name.
 *
 * The component also handles the case where the user is not authenticated and
 * tries to access a protected route. In this case, the user is redirected to
 * the login page.
 */
const TopNavBar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await signOut({ redirect: false });
    setTimeout(() => {
      router.push("/auth/signin");
      setIsSigningOut(false);
    }, 500);
  };

  const handleLogin = () => {
    router.push("/auth/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Escape") setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-3 max-w-10xl mx-auto">
        {/* Logo and tagline */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-blue-600">My Blog</h1>
          <p className="text-base text-gray-600 mt-1">
            Sharing knowledge and stories worldwide
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-blue-600 hover:underline text-lg">
            Home
          </Link>
          {session && (
            <Link
              href="/my-posts"
              className="text-blue-600 hover:underline text-lg"
            >
              My Posts
            </Link>
          )}
          {session && (
            <Link
              href="/create-post"
              className="text-blue-600 hover:underline text-lg"
            >
              Create Post
            </Link>
          )}

          {/* User Dropdown */}
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded flex items-center text-base"
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                {session.user?.name || session.user?.email}
                <span className="ml-2">&#x25BC;</span>
              </button>
              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-48 transition-opacity duration-300"
                  role="menu"
                  aria-label="User Menu"
                >
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    role="menuitem"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <>
                        <CircularProgress size={20} style={{ color: "gray" }} />
                        <span>Signing Out...</span>
                      </>
                    ) : (
                      "Log Out"
                    )}
                  </button>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-green-500 hover:bg-green-400 text-white font-medium py-2 px-4 rounded text-base"
              style={{
                width: "90px",
                height: "36px",
              }}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
