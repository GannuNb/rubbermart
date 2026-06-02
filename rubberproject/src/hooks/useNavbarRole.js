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

  const isTransporter =
    user?.role === "transporter";


  /* =========================
      DASHBOARD USER
  ========================== */

  const isDashboardUser =
  isSeller || isAdmin || isTransporter;


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

    if (isTransporter) {
      return "/transporter-dashboard";
    }

    return "/";
  };


  return {

    isGuest,

    isBuyer,

    isSeller,

    isAdmin,
    
    isTransporter,

    isDashboardUser,

    getLogoPath,
  };
}

export default useNavbarRole;