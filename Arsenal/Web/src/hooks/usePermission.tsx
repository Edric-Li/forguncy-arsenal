import { useCallback, useRef } from 'react';

const usePermission = () => {
  const roleSetRef = useRef<Set<string> | null>(null);

  const getRoleSet = () => {
    if (roleSetRef.current === null) {
      // @ts-ignore
      const { Role = '', InheritedPermissionRoles = '' } = Forguncy.ForguncyData.userInfo;

      const set: Set<string> = new Set();
      const roles = [...Role.split(','), ...InheritedPermissionRoles.split(',')];

      roles.forEach((i: string) => {
        if (i) {
          set.add(i);
        }
      });

      roleSetRef.current = set;
    }

    return roleSetRef.current;
  };

  const hasPermission = useCallback((roles: string[]) => {
    if (roles.includes('FGC_Anonymous')) {
      return true;
    }
    if (roles.includes('FGC_LoginUser')) {
      return roles.length;
    }
    return !!roles.find((i) => getRoleSet().has(i));
  }, []);

  return {
    hasPermission,
  };
};

export default usePermission;
