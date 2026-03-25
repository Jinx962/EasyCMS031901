type MenuNode = {
  permission: string;
  route_path: string | null;
  children?: MenuNode[];
};

type AccessSnapshot = {
  routes: string[];
  permissions: string[];
};

const ACCESS_KEY = "easycms_access_snapshot";

function walkMenus(
  menus: MenuNode[],
  routes: Set<string>,
  permissions: Set<string>,
) {
  menus.forEach((menu) => {
    const routePath = (menu.route_path || "").trim();
    const permission = (menu.permission || "").trim();
    if (routePath.startsWith("/")) {
      routes.add(routePath);
    }
    if (permission) {
      permissions.add(permission);
    }
    if (menu.children?.length) {
      walkMenus(menu.children, routes, permissions);
    }
  });
}

export function setAccessFromMenus(menus: MenuNode[]) {
  const routes = new Set<string>();
  const permissions = new Set<string>();
  walkMenus(menus, routes, permissions);

  const snapshot: AccessSnapshot = {
    routes: [...routes],
    permissions: [...permissions],
  };
  sessionStorage.setItem(ACCESS_KEY, JSON.stringify(snapshot));
}

function getAccessSnapshot(): AccessSnapshot {
  if (typeof window === "undefined") {
    return { routes: [], permissions: [] };
  }
  try {
    const raw = sessionStorage.getItem(ACCESS_KEY);
    if (!raw) return { routes: [], permissions: [] };
    const parsed = JSON.parse(raw) as AccessSnapshot;
    return {
      routes: Array.isArray(parsed.routes) ? parsed.routes : [],
      permissions: Array.isArray(parsed.permissions) ? parsed.permissions : [],
    };
  } catch {
    return { routes: [], permissions: [] };
  }
}

export function clearAccessSnapshot() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS_KEY);
}

export function getAllowedRoutes() {
  return getAccessSnapshot().routes;
}

export function can(permission: string) {
  return getAccessSnapshot().permissions.includes(permission);
}

export function hasRouteAccess(pathname: string) {
  const routes = getAccessSnapshot().routes;
  if (pathname === "/") return true;
  if (pathname === "/403") return true;
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
