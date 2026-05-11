function useNavbarRole(user) {

  /* =========================
      ROLE CHECKS
  ========================== */

  const isGuest = !user;

  const isBuyer =
    user?.role === "buyer";

  const isSeller =
    user?.role === "seller";

  const isAdmin =
    user?.role === "admin";


  /* =========================
      DASHBOARD USER
  ========================== */

  const isDashboardUser =
    isSeller || isAdmin;


  /* =========================
      LOGO PATH
  ========================== */

  const getLogoPath = () => {

    if (isGuest) {
      return "/";
    }

    if (isAdmin) {
      return "/admin-dashboard";
    }

    if (isSeller) {
      return "/seller-dashboard";
    }

    return "/home";
  };


  return {

    isGuest,

    isBuyer,

    isSeller,

    isAdmin,

    isDashboardUser,

    getLogoPath,
  };
}

export default useNavbarRole;