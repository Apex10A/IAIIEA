export const usePortalAccess = () => {
    const checkAccess = (portalType: string | number) => {
      const access = JSON.parse(localStorage.getItem('userPortalAccess') || '{}');
      return access[portalType] || false;
    };
  
    return { checkAccess };
  };