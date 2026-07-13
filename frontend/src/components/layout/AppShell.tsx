import { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/habits", label: "Habits" },
  { to: "/events", label: "Events" },
  { to: "/analytics", label: "Analytics" },
]

export function AppShell() {
  const { pathname } = useLocation()
  const isDashboard = pathname === "/dashboard"
  const [navRevealed, setNavRevealed] = useState(false)

  useEffect(() => {
    if (!isDashboard) return

    function handleScroll() {
      setNavRevealed(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDashboard])

  const navHidden = isDashboard && !navRevealed

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={cn(
          "border-b border-border transition-transform duration-300",
          isDashboard && "fixed inset-x-0 top-0 z-20 bg-background",
          navHidden && "-translate-y-full border-transparent"
        )}
      >
        <nav
          className={cn(
            "mx-auto flex w-full max-w-5xl flex-wrap items-center gap-4 px-6 py-4",
            isDashboard ? "justify-center" : "justify-between"
          )}
        >
          {!isDashboard && (
            <span className="text-lg font-semibold text-foreground">TimesUp</span>
          )}
          <ul className="flex flex-wrap gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
