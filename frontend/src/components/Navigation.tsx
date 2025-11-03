import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {/* change to Uwe~Talk logo */}
              <Languages className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl">Uwe~Talk</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className={isActive("/") ? "bg-primary" : ""}
              >
                Home
              </Button>
            </Link>
            <Link to="/translate">
              <Button
                variant={isActive("/translate") ? "default" : "ghost"}
                className={isActive("/translate") ? "bg-primary" : ""}
              >
                Translate
              </Button>
            </Link>
            <Link to="/api">
              <Button
                variant={isActive("/api") ? "default" : "ghost"}
                className={isActive("/api") ? "bg-primary" : ""}
              >
                API
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "default" : "ghost"}
                className={isActive("/admin") ? "bg-primary" : ""}
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
