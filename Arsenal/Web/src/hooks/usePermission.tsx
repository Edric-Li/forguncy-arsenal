import { useCallback, useEffect, useState } from 'react';

const usePermission = () => {
  const [roleSet, setRoleSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    // @ts-ignore
    const { Role, InheritedPermissionRoles } = Forguncy.ForguncyData.userInfo;

    const set: Set<string> = new Set();
    const roles = [...Role.split(','), ...InheritedPermissionRoles.split(',')];

    roles.forEach((i: string) => {
      if (i) {
        set.add(i);
      }
    });

    setRoleSet(set);
  }, []);

  const hasPermission = useCallback(
    (roles: string[]) => roles.includes('FGC_Anonymous') || !!roles.find((i) => roleSet.has(i)),
    [roleSet],
  );

  return {
    hasPermission,
  };
};

export default usePermission;
